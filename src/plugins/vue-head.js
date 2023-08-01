import VueHead from 'vue-head'

/**
 * Manipulating the meta information of the head tag, a simple and easy way
 * https://github.com/ktquez/vue-head
 */
export function initVueHead(app) {
  app.use(VueHead, /*{
    separator: '|',
    complement: import.meta.env.VITE_APP_PROJECT_NAME
  }*/)
}
