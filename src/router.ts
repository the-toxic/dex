import { createRouter, createWebHistory, RouteParams, RouteRecordRaw } from 'vue-router'
import { loadLayoutMiddleware } from "@/middlewares/router.middleware";
import { AppLayoutsEnum } from "@/types";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";

import Home from "@/views/Home.vue";
import E404 from "@/views/E404.vue";
// import Career from "@/views/Career.vue";
import ContactUs from "@/views/ContactUs.vue";

type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & {
  name: string,
  children?: readonly AppRouteRecord[]
}

type GetRouteName<T extends AppRouteRecord> =
  T extends { children: readonly AppRouteRecord[] }
    ? T['name'] | GetRoutesNames<T['children']>
    : T['name']
type GetRoutesNames<T extends readonly AppRouteRecord[]> = GetRouteName<T[number]>


const routes = [
  { path: '/', name: 'Home', component: Home, meta: { layout: AppLayoutsEnum.empty } },
  { path: '/console', name: 'ConsoleWrap', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/components/Console.vue"), children: [
    { path: '', name: 'Console', meta: { needAuth: true }, redirect: { name: 'Pairs',  params: {network: 'ethereum'} } },
    { path: 'dashboard', name: 'Dashboard', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Dashboard.vue") },
    { path: ':network([a-zA-Z0-9-]{2,10})/explorer', name: 'Pairs', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Pairs.vue") },
    { path: 'pair/:id(0x[a-zA-Z0-9]{40})', name: 'Pair', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Pair.vue") },
    { path: ':network([a-zA-Z0-9-]{2,10})/big-swaps', name: 'BigSwaps', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/BigSwaps.vue") },

    { path: 'entity/:id([a-zA-Z0-9-]{36})', name: 'Entity', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Entity.vue") },
    { path: 'address/:id([a-zA-Z0-9-]{42})', name: 'Address', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Entity.vue") },
    { path: 'token/:id([a-zA-Z0-9-]{42})', name: 'Token', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Token.vue") },

    { path: 'privateLabels', name: 'PrivateLabels', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/PrivateLabels.vue") },
    { path: 'sc', name: 'SC', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/SC.vue") },
    { path: 'segments', name: 'Segments', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Segments.vue") },
    { path: 'watchlist', name: 'WatchList', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/WatchList.vue") },
    { path: 'profile', name: 'Profile', meta: { needAuth: true }, component: () => import(/* webpackChunkName: "console" */ "@/views/Profile.vue") },
  ]},
  // { path: '/career', name: 'Career', component: Career },
  { path: '/contact-us', name: 'ContactUs', component: ContactUs },
  // { path: '/console', name: 'Console', meta: { needAuth: true }, redirect: { name: 'Pair', params: {network: 'bsc', id: '0x1b96b92314c44b159149f7e0303511fb2fc4774f'} } },
  // { path: '/auth/sign-in', name: 'AuthSignIn', component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue'), meta: { layout: AppLayoutsEnum.auth } },
  { path: '/auth', name: 'AuthWrap', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth.vue"), meta: { layout: AppLayoutsEnum.empty }, children: [
      { path: '', name: 'RedirectToSignIn', redirect: '/auth/sign-in'},
      { path: 'sign-in', name: 'AuthSignIn', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth.vue")},
      { path: 'sign-up', name: 'AuthSignUp', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth.vue")},
      { path: 'reset-password', name: 'AuthResetPassword', component: () => import(/* webpackChunkName: "auth" */ "@/views/auth/Auth.vue")},
    ], /*beforeEnter(to, from, next) { next(!store.getters['user/logged'] ? true : {name: 'Console'}) }*/
  },
  { path: '/:pathMatch(.*)*', name: 'E404', component: E404, meta: { layout: AppLayoutsEnum.empty }}
] as const satisfies readonly AppRouteRecord[]

type TRoutes = typeof routes
type TRoutesNames = GetRoutesNames<TRoutes>

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as unknown as RouteRecordRaw[],
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

type TRouteTo = {
  name: TRoutesNames,
  params?: RouteParams
}

export function toRoute(to: TRouteTo) {
  return to
}
