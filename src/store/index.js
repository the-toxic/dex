import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import user from "./modules/user";
import chart from "./modules/chart";
import wallet from "./modules/wallet";

const initShowCookie = (() => !window.localStorage.getItem('cookiePopup'))()

export default new Vuex.Store({
  // deny on change state, without commits (this.$store.state.cartCnt++)
  // enable in dev work, because tracking the storage change method increases the load on the browser
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    chart,
    wallet
  },
  state: {
    globalLoader: false,
    alert: {
      msg: '',
      color: ''
    },
    wsConnected: false,
    dialog: false,
    subscribeForm: false,
    showCookie: initShowCookie,
  },
  getters: {
    globalLoader: state => (state.globalLoader),
    wsConnected: state => (state.wsConnected),
    subscribeForm: state => (state.subscribeForm),
    // getTankById: state => (id) => (state.tanks.find(item => item.id === id)),
  },
  mutations: {
    setGlobalLoader(state, payload) {
      state.globalLoader = payload
    },
    setAlert(state, payload) {
      state.alert.msg = payload.msg || ''
      state.alert.color = payload.color || ''
    },
    setDialog(state, name) {
      state.dialog = name || false
    },
    setSubscribeForm(state, visible) {
      state.subscribeForm = visible || false
    },
    cookieAccept(state) {
      state.showCookie = false
    },
    setConnected(state, payload) {
      state.wsConnected = payload || false
    },
  },
  actions: {
    showAlert({commit}, payload) {
      if (typeof payload === "string") payload = {msg: payload, color: 'error'}
      commit('setAlert', payload)
      setTimeout(() => commit('setAlert', {msg: '', color: ''}), 7000)
    },
    showDialog({commit}, payload) {
      commit('setDialog', payload)
    },
    showSubscribeForm({commit}, payload) {
      commit('setSubscribeForm', payload)
    },
    cookieAccept({commit}) {
      window.localStorage.setItem('cookiePopup', 'accept')
      commit('cookieAccept')
    },
  },
})
