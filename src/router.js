import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"
import Home from "@/views/Home.vue";
import E404 from "@/views/E404.vue"
import NewChart from "@/views/NewChart.vue";
import Analyse from "@/views/Analyse";
import Liquidity from "@/views/Liquidity";

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active", // класс активного пункта меню
  linkExactActiveClass: "exact-active",
  routes: [
    { path: '/', name: 'Pairs', redirect: { name: 'Pair', params: {network: 'bsc', pairAddr: '0x1b96b92314c44b159149f7e0303511fb2fc4774f'} } },
    { path: '/home', name: 'Home', component: Home },
    { path: '/console/:network([a-zA-Z0-9]{2,10})/pe/:pairAddr([a-zA-Z0-9]{42})', name: 'Pair', component: NewChart },
    { path: '/console/analyse', name: 'Analyse', component: Analyse },
    { path: '/console/liquidity', name: 'Liquidity', component: Liquidity },
    // { path: '/newChart', name: 'NewChart', component: NewChart },
    { path: '/auth', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth"), meta: { limitedWidth: false }, children: [
        { path: '', redirect: '/auth/sign-in'},
        { path: 'sign-up', name: 'AuthSignUp'},
        { path: 'sign-in', name: 'AuthSignIn'},
        { path: 'reset-password', name: 'AuthResetPassword'},
        { path: 'reset-password/set-new', name: 'AuthSetNewPassword' },
        { path: 'email-confirm', name: 'AuthEmailConfirm', meta: { limitedWidth: false } },
      ], /*beforeEnter(to, from, next) { next(!store.getters['user/logged'] ? true : {name: 'Pairs'}) }*/
    },
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
  // document.title = to.name + ' | ' + process.env.VUE_APP_PROJECT_NAME // change page title on redirect
  store.commit('setGlobalLoader', true)
  setTimeout(() => store.commit('setGlobalLoader', false), 1000)

  // if(to.matched.some(item => item.meta?.['userLogged']) && !store.getters['user/logged']) {
  //   next({ name: 'Home' })
  // }
  // if(to.matched.some(item => item.meta?.['Pairs']) && !mainStore.getters['wallet/account']) {
  //   if(from.name === null) {
  //     next({name: 'Home'}) // on load page
  //     return
  //   }
  //   mainStore.dispatch('showWalletDialog', true).then()
  // }
  next()

})

export default router