import { createRouter, createWebHistory } from "vue-router"
import { useMainStore } from "@/stores/main";
import Home from "@/views/Home.vue";
import Pair from "@/views/Pair.vue";
import E404 from "@/views/E404.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/pairs', name: 'Pairs', redirect: { name: 'Pair', params: {network: 'bsc', pair: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'} } },
    { path: '/:network([a-zA-Z0-9]{2,10})/pair/:pair([a-zA-Z0-9]{42})', name: 'Pair', component: Pair },
    { path: '/:pathMatch(.*)*', name: 'E404', component: E404 }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.name + ' | HAZB' // change page title on redirect

  const mainStore = useMainStore()

  mainStore.globalLoader = true
  setTimeout(() => mainStore.globalLoader = false, 1000)

  next()

  // if(to.matched.some(item => item.meta?.['garageLogged']) && !mainStore.getters['garage/account']) {
  //   if(from.name === null) {
  //     next({name: 'Home'}) // on load page
  //     return
  //   }
  //   mainStore.dispatch('showWalletDialog', true).then()
  // }
})

export default router