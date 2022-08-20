import Vue from 'vue'
import VueVirtualScroller from 'vue-virtual-scroller'
import router from '@/router'
import store from '@/store'
import vuetify from './plugins/vuetify'

Vue.use(VueVirtualScroller)

import '@/plugins/vue-head'
import '@/plugins/vue-gtag'
import '@/plugins/clipboard'

import {httpInt} from './helpers/interceptors';
httpInt();

import '@/styles/site.scss'

import '@/helpers/web3'

store.commit('wallet/loginWithLocalStorage');

import App from '@/App.vue'
import CopyLabel from "@/components/CopyLabel"
Vue.component('CopyLabel', CopyLabel)

import "@/helpers/mixins"

// Vue.config.devtools = false
// Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
