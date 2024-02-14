import { createApp } from 'vue'
import { createPinia } from 'pinia'
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
import { initUnhead } from '@/plugins/unhead'

app
  .use(vuetify)
  .use(router)
  .component('CopyLabel', CopyLabel)

httpInt();
initVueGtag(app)
initClipboard(app)
initUnhead(app)

app.mount('#app')

