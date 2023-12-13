import { createHead, useHead, VueHeadMixin } from '@unhead/vue'
import { App } from "vue";

/**
 * Manipulating the meta information of the head tag, a simple and easy way
 * https://github.com/ktquez/vue-head
 */
export function initUnhead(app: App) {
  const head = createHead()
  app.use(head) // enable useHead()
  app.mixin(VueHeadMixin) // for support use in options API
  // options set in App.vue
}

// Options API use:
// head: { title: 'Hello'},
// head: () => ({ title: this.title }),

// Composition API use:
// useHead({
//   templateParams: {
//     site: {
//       name: 'HAZB',
//     },
//     separator: '|',
//   },
//   titleTemplate: '%s %separator %site.name',
//   title: 'HAZB - Embrace the future of crypto intelligence today!',
//   // meta: [{ name: 'description', content: this.description }]
// })

// useHead({
//   script: [ { src: 'https://example.com/analytics.js', onload: (el) => {console.log('loaded', el)}, tagPosition: 'bodyClose' } ]
//   // positions: head | bodyOpen | bodyClose
// }, { mode: 'client' }) // mode: client - for delayed load script
