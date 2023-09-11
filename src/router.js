import { createRouter, createWebHistory } from 'vue-router'
import { loadLayoutMiddleware } from "@/middlewares/router.middleware";
import { AppLayoutsEnum } from "@/helpers";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";


import Home from "@/views/Home.vue";
import E404 from "@/views/E404.vue";
import Career from "@/views/Career.vue";
import ContactUs from "@/views/ContactUs.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/console', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/components/Console"), children: [
    { path: '', name: 'Console', meta: { needAuth: true }, redirect: { name: 'Pairs',  params: {network: 'bsc'} } },
    { path: ':network([a-zA-Z0-9-]{2,10})/explorer', name: 'Pairs', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Pairs.vue") },
    { path: ':network([a-zA-Z0-9-]{2,10})/big-swaps', name: 'BigSwaps', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/BigSwaps.vue") },

    { path: 'entity/:id([a-zA-Z0-9-]{1,32})', name: 'Entity', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Entity.vue") },
    { path: 'token/:id([a-zA-Z0-9-]{1,32})', name: 'Token', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Address.vue") },
    { path: 'wallet/:id([a-zA-Z0-9-]{1,32})', name: 'Wallet', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Address.vue") },

    { path: 'sc', name: 'SC', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/SC.vue") },
    { path: ':network([a-zA-Z0-9-]{2,10})/pair/:pairAddr([a-zA-Z0-9]{42})', name: 'Pair', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Pair.vue") },
    { path: 'career', name: 'Career', component: Career },
    { path: 'contact-us', name: 'ContactUs', component: ContactUs },
    { path: 'portfolio', name: 'Portfolio', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Portfolio.vue") },
    { path: 'alerts', name: 'Alerts', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Alerts.vue") },
    { path: 'watchlist', name: 'WatchList', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/WatchList.vue") },
    { path: 'profile', name: 'Profile', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Profile.vue") },

  ]},
  // { path: '/console', name: 'Console', meta: { needAuth: true }, redirect: { name: 'Pair', params: {network: 'bsc', pairAddr: '0x1b96b92314c44b159149f7e0303511fb2fc4774f'} } },
  // { path: '/auth/sign-in', name: 'AuthSignIn', component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue'), meta: { layout: AppLayoutsEnum.auth } },
  { path: '/auth', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth"), meta: { layout: AppLayoutsEnum.auth }, children: [
      { path: '', redirect: '/auth/sign-in'},
      { path: 'sign-in', name: 'AuthSignIn', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth")},
      { path: 'sign-up', name: 'AuthSignUp', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth")},
      { path: 'reset-password', name: 'AuthResetPassword', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth")},
    ], /*beforeEnter(to, from, next) { next(!store.getters['user/logged'] ? true : {name: 'Console'}) }*/
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
