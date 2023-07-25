import VueGtag from 'vue-gtag'
import router from '@/router'

// https://matteo-gabriele.gitbook.io/vue-gtag/

const gaId = import.meta.env.VITE_APP_GA_ID || ''

const isProduction = import.meta.env.MODE === 'production' // window.location.host.includes('.com')

export function initVueGtag(app) {
  if (!gaId || !isProduction) return false

  app.use(VueGtag, {
    // enabled: true,
    // disableScriptLoad: false,
    // bootstrap: true,
    // globalObjectName: "gtag",
    // globalDataLayerName: "dataLayer",
    // pageTrackerEnabled: true,
    // pageTrackerScreenviewEnabled: false,
    // pageTrackerSkipSamePath: true,
    // defaultGroupName: "default",
    // includes: null,
    config: {
      id: gaId,
      // params: {
      //   send_page_view: false
      // }
    },
    // onReady: () => {},
    // pageTrackerTemplate: () => {},
    // onBeforeTrack: () => {},
    // onAfterTrack: () => { console.log('after redirect') }
  }, router) // router need for SPA redirects
  return true
}


