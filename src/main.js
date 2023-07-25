import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import VueVirtualScroller from 'vue-virtual-scroller'
import CopyLabel from "@/components/CopyLabel.vue";


import './assets/styles/main.scss'

import App from './App.vue'
const app = createApp(App)
app.use(createPinia())

import router from './router'

import vuetify from './plugins/vuetify'
// const { default: vuetify } = await import('@/plugins/vuetify')
import { initVueGtag } from '@/plugins/vue-gtag'
import { initClipboard } from '@/plugins/clipboard'
import { httpInt } from './middlewares/interceptors'

app
  .use(vuetify)
  .use(router)
  .component('CopyLabel', CopyLabel)
  .use(VueVirtualScroller)

httpInt();
initVueGtag(app)
initClipboard(app)

app.mount('#app')

// import { initVueHead } from '@/plugins/vue-head'
// initVueHead(app)
