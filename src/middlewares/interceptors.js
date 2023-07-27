import axios from 'axios';
import { useMainStore } from "@/store/mainStore";
import { useUserStore } from "@/store/userStore";
// import { useWalletStore } from "@/store/walletStore";
const mainStore = () => useMainStore()
const userStore = () => useUserStore()
// const walletStore = () => useWalletStore()

let apiDomain = import.meta.env.VITE_APP_API_DOMAIN
if(window.location.host.includes('.app') || window.location.host.includes('localhost')) { // if dev
  apiDomain =  import.meta.env.VITE_APP_API_DOMAIN_DEV
}
axios.defaults.baseURL = apiDomain + import.meta.env.VITE_APP_API_PATH;

export function httpInt() {
  axios.interceptors.request.use(function(config) {
    const pattern = /^https?:\/\//;
    if(!pattern.test(config.url)) { // if the request is not sent to an external url

      if(!config.url.includes('auth')) {
        const token = userStore().user?.token
        if(token) config.headers['access-token'] = token
      }
      // config.headers.Authorization = `Basic / Bearer 123423534623abc=`
      // if(!config.headers['x-path']) config.headers['x-path'] = encodeURI(config.url.split('?')[0])
    }
    return config;

  }, function(err) {
    return Promise.reject(err);
  });

  axios.interceptors.response.use(function (response) {
    return response;

  }, async function (error) {
    // console.dir(error)
    const isSilenceAlert = 'silenceAlert' in error.config

    if(!error.response) { // 500 error or CORS
      if(!isSilenceAlert) await mainStore().showAlert({msg: 'Error. Please try later.', color: 'error'})
      return {data: {success: false}}
    }

    const code = parseInt(error.response && error.response.status)
    if(code === 401) {
      await userStore().logOut() // reload page
      await mainStore().showAlert({msg: 'Session expired. Re-login please.', color: 'error'})
      return {data: {success: false}}
      // if(error.response.config.url.includes('console/')) {
      //   await walletStore().logOut()
      //   await mainStore().showAlert({msg: 'Session expired. Need to reconnect MetaMask account.', color: 'error'})
      // }
      // return Promise.reject('Session expired');

    }

    const msg = error.response.data?.error?.text || error.response.data?.error?.message || error.response.data?.error?.description

    if(msg) {
      if(!isSilenceAlert) await mainStore().showAlert({msg, color: 'error'})
      return error.response
    }

    const data = error.response.data

    if(code === 422 && 'detail' in data && data.detail.length) {
      if(!isSilenceAlert) {
        if(data.detail[0].type === 'value_error.missing') {
          await mainStore().showAlert('Invalid params')
        } else {
          let field = data.detail[0].loc[1].split('_').join(' ')
          field = field.charAt(0).toUpperCase() + field.slice(1)
          const msg = field + ': ' + data.detail[0].msg
          await mainStore().showAlert({msg, color: 'error'})
        }
      }
      return error.response
    }

    await mainStore().showAlert('Internal error. Please try later.')
    // return Promise.reject(error);
    return error.response

  });

}
