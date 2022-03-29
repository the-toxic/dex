import Vue from 'vue'
import VueGtag from 'vue-gtag'
import router from '@/router'

// https://matteo-gabriele.gitbook.io/vue-gtag/

const gaId = process.env.VUE_APP_GA_ID || ''

const isProduction = process.env.NODE_ENV === 'production' // window.location.host.includes('.com')

if (gaId && isProduction) {
  Vue.use(VueGtag, {
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
}
