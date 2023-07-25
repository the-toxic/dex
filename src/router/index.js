import { createRouter, createWebHistory } from 'vue-router'
import { loadLayoutMiddleware } from "@/middlewares/router.middleware";
import { AppLayoutsEnum } from "@/helpers";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";


import Home from "@/views/Home.vue";
import E404 from "@/views/E404.vue";
import Analyse from "@/views/Analyse.vue";
import Liquidity from "@/views/Liquidity.vue";
// import NewChart from "@/views/NewChart.vue";
const NewChart = () => import(/* webpackChunkName: "console" */ "@/views/NewChart.vue")


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/console', name: 'Pairs', redirect: { name: 'Pair', params: {network: 'bsc', pairAddr: '0x1b96b92314c44b159149f7e0303511fb2fc4774f'} } },
  { path: '/console/:network([a-zA-Z0-9]{2,10})/pe/:pairAddr([a-zA-Z0-9]{42})', name: 'Pair', component: NewChart },
  { path: '/console/analyse', name: 'Analyse', component: Analyse },
  { path: '/console/liquidity', name: 'Liquidity', component: Liquidity },
  // { path: '/auth/sign-in', name: 'AuthSignIn', component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue'), meta: { layout: AppLayoutsEnum.auth } },
  { path: '/auth', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth"), meta: { layout: AppLayoutsEnum.auth }, children: [
      { path: '', redirect: '/auth/sign-in'},
      { path: 'sign-in', name: 'AuthSignIn', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth")},
      { path: 'sign-up', name: 'AuthSignUp', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth")},
      { path: 'reset-password', name: 'AuthResetPassword', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth")},
      { path: 'reset-password/set-new', name: 'AuthSetNewPassword', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth")},
      { path: 'email-confirm', name: 'AuthEmailConfirm', meta: { limitedWidth: false } },
    ], /*beforeEnter(to, from, next) { next(!store.getters['user/logged'] ? true : {name: 'Pairs'}) }*/
  },
  { path: '/:pathMatch(.*)*', component: E404, meta: { layout: AppLayoutsEnum.error }}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(loadLayoutMiddleware);

router.beforeEach((to, from) => {
  const mainStore = useMainStore()
  const userStore = useUserStore()

  mainStore.setGlobalLoader(true)
  setTimeout(() => mainStore.setGlobalLoader(false), 1000)

  return (to.meta.needAuth && !userStore.logged) ? {name: 'AuthSignIn'} : true
})

export default router
