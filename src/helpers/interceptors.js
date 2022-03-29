import axios from 'axios';
import store from '../store';

let apiDomain = process.env.VUE_APP_API_DOMAIN
// if(window.location.host.includes('.xyz') || window.location.host.includes('localhost')) { // if dev
//   apiDomain =  process.env.VUE_APP_API_DOMAIN_DEV
// } else {
//   apiDomain =  process.env.VUE_APP_API_DOMAIN
// }
axios.defaults.baseURL = apiDomain + process.env.VUE_APP_API_PATH;

export function httpInt() {
  axios.interceptors.request.use(function(config) {
    // const pattern = /^https?:\/\//;
    // if(!pattern.test(config.url)) { // if the request is not sent to an external url
        // config.headers.Authorization = `Bearer ${token}`
    // }
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
      if(!isSilenceAlert) await store.dispatch('showAlert', ({msg: 'Error. Please try later.', color: 'error'}))
      return {data: {success: false}}
    }

    const code = parseInt(error.response && error.response.status)
    // if(code === 401) {
    //   if(error.response.config.url.includes('garage/')) {
    //     await store.dispatch('garage/logOut')
    //     await store.dispatch('showWalletDialog', true)
    //     await store.dispatch('showAlert', {msg: 'Session expired. Need to reconnect MetaMask account.', color: 'error'})
    //   } else {
    //     await store.dispatch('user/logOut');
    //     await store.dispatch('showAlert', {msg: 'Session expired.', color: 'error'})
    //   }
    //   // return Promise.reject('Session expired');
    //   return {data: {success: false}}
    // }

    const msg = error.response.data?.error?.description

    if(msg) {
      if(!isSilenceAlert) await store.dispatch('showAlert', ({msg, color: 'error'}))
      return error.response
    }

    const data = error.response.data

    // if(code === 422 && 'detail' in data && data.detail.length) {
    //   if(!isSilenceAlert) {
    //     if(data.detail[0].type === 'value_error.missing') {
    //       await store.dispatch('showAlert','Invalid params')
    //     } else {
    //       let field = data.detail[0].loc[1].split('_').join(' ')
    //       field = field.charAt(0).toUpperCase() + field.slice(1)
    //       const msg = field + ': ' + data.detail[0].msg
    //       await store.dispatch('showAlert', {msg, color: 'error'})
    //     }
    //   }
    //   return error.response
    // }

    // 'Internal error. Please try later.'
    // return Promise.reject(error);
    return error.response

  });

}
