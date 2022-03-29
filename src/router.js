import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"
import Home from "@/views/Home.vue";
import Pair from "@/views/Pair.vue";
import E404 from "@/views/E404.vue"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active", // класс активного пункта меню
  linkExactActiveClass: "exact-active",
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/pairs', name: 'Pairs', redirect: { name: 'Pair', params: {network: 'bsc', pair: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'} } },
    { path: '/:network([a-zA-Z0-9]{2,10})/pair/:pair([a-zA-Z0-9]{42})', name: 'Pair', component: Pair },
    { path: '/:pathMatch(.*)*', name: 'E404', component: E404 }
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return new Promise(resolve => // promise for correct scroll after redirect to other page
      setTimeout(() => resolve({selector: to.hash, behavior: 'smooth'}), 200))
    if (savedPosition) return savedPosition // return goTo(savedPosition.y)
    return { x: 0, y: 0 } // return goTo(scrollTo)
  },
})

router.beforeEach((to, from, next) => {
  // document.title = to.name + ' | HAZB' // change page title on redirect
  store.commit('setGlobalLoader', true)
  setTimeout(() => store.commit('setGlobalLoader', false), 1000)

  // if(to.matched.some(item => item.meta?.['garageLogged']) && !mainStore.getters['garage/account']) {
  //   if(from.name === null) {
  //     next({name: 'Home'}) // on load page
  //     return
  //   }
  //   mainStore.dispatch('showWalletDialog', true).then()
  // }
  next()

})

export default router