import axios, { CanceledError } from 'axios';
import { useMainStore } from "@/store/mainStore";
import { useUserStore } from "@/store/userStore";
import { refreshJwt } from "@/api";
// import { useWalletStore } from "@/store/walletStore";
const mainStore = () => useMainStore()
const userStore = () => useUserStore()
// const walletStore = () => useWalletStore()

const isDev = window.location.host.includes('localhost') || window.location.host.includes('.app')
const apiDomain = isDev ? import.meta.env.VITE_APP_API_DOMAIN_DEV : import.meta.env.VITE_APP_API_DOMAIN
axios.defaults.baseURL = apiDomain + import.meta.env.VITE_APP_API_PATH;
let prevRequest: any = null;

export function httpInt() {
  axios.interceptors.request.use(function(config) {
    // if the request is sent to an external url
    if(/^https?:\/\//.test(config.url as string)) {
      return config;
    }

    if(!(config.url as string).includes('auth')) { // no auth pages requests, add header
      const token = userStore().user?.jwt
      if (token) config.headers.Authorization = `Bearer ${token}`
    }

    const controller = new AbortController();
    const signal = controller.signal;

    if (prevRequest && prevRequest.url === (config.url as string).split('?')[0] && prevRequest.controller) {
      // console.log('Canceled request:', prevRequest.url, prevRequest.controller.signal.aborted)
      prevRequest.controller.abort(); // cancel previews request
    }
    prevRequest = {
      url: (config.url as string).split('?')[0],
      controller: controller
    };
    config.signal = signal;

    return config
    // config.headers.Authorization = `Basic / Bearer 123423534623abc=`
    // if(!config.headers['x-path']) config.headers['x-path'] = encodeURI(config.url.split('?')[0])

  }, function(err) {
    return Promise.reject(err);
  });

  axios.interceptors.response.use(function (response) {
    return response;

  }, async function (error) {

    if(error instanceof CanceledError) { // on cancel duplicated request
      // console.log('axios.interceptors.response - CanceledError')
      // await Promise.reject(error);
      return {data: {success: false, canceled: true}}
    }

    // console.dir(error)
    const isSilenceAlert = 'silenceAlert' in error.config

    if(!error.response) { // 500 error or CORS
      if(!isSilenceAlert) mainStore().showAlert({msg: 'Error. Please try later.', color: 'error'})
      return {data: {success: false}}
    }

    const code = parseInt(error.response && error.response.status)
    const originalConfig = error?.config;

    if(code === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const { data } = await refreshJwt({token: userStore().user?.refresh}) // response 403 if expire
        if(!data?.success || !data.result?.['access_token']) {
          console.warn('Refresh token is expired!')
          throw new Error(data)
        }

        userStore().updateUser({
          jwt: data.result['access_token'],
          refresh: data.result['refresh_token'],
        })

        // Retry original request
        return axios({
          ...originalConfig,
          headers: { ...originalConfig.headers } // fix bug axios library
        });

      } catch (error) {
        await userStore().logOut()
        mainStore().showAlert({msg: 'Session expired. Re-login please.', color: 'error'})
        return {data: {success: false}}
        // return Promise.reject(error);
      }

      // await userStore().logOut() // reload page
      // await mainStore().showAlert({msg: 'Session expired. Re-login please.', color: 'error'})
      // return {data: {success: false}}

      // if(error.response.config.url.includes('console/')) {
      //   await walletStore().logOut()
      //   await mainStore().showAlert({msg: 'Session expired. Need to reconnect MetaMask account.', color: 'error'})
      // }
      // return Promise.reject('Session expired');

    }

    const msg = error.response.data?.error?.text || error.response.data?.error?.message || error.response.data?.error?.description

    if(msg) {
      if(!isSilenceAlert) mainStore().showAlert({msg, color: 'error'})
      return error.response
    }

    const data = error.response.data

    if(code === 422 && 'detail' in data && data.detail.length) {
      if(!isSilenceAlert) {
        if(data.detail[0].type === 'value_error.missing') {
          mainStore().showAlert('Internal error [Invalid params]')
        } else {
          let field = data.detail[0].loc[1]?.split('_').join(' ')
          field = !field ? 'Error' : field.charAt(0).toUpperCase() + field.slice(1)
          const msg = field + ': ' + data.detail[0].msg
          mainStore().showAlert({msg, color: 'error'})
        }
      }
      return error.response
    }

    mainStore().showAlert('Internal error. Please try later.')
    // return Promise.reject(error);
    return error.response

  });

}
