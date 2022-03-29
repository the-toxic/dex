export default {
  namespaced: true,
  state: {
    account: '',
    // jwt: '',
    // sign_phrase: '',
    // expired: null
  },
  getters: {
    account: state => state.account,
    // jwt: state => state.jwt,
    // sign_phrase: state => state.sign_phrase,
    // // user: state => state.user,
    // expired: state => state.expired
  },
  mutations: {
    login(state, payload) {
      state.account = payload.account
      // state.jwt = payload.jwt
      // state.sign_phrase = payload.sign_phrase
      // state.expired = payload.expired
      window.localStorage.setItem('wallet', JSON.stringify(payload))
      // setSentryWallet(state.account)
    },
    logOut(state) {
      state.account = ''
      // state.jwt = ''
      // state.sign_phrase = ''
      // state.expired = null
      window.localStorage.removeItem('wallet')
    },
    loginWithLocalStorage(state) {
      if(window.localStorage.getItem('wallet')) {
        const wallet = JSON.parse(window.localStorage.getItem('wallet'));
        // if(wallet.expired > +(+new Date()).toString().slice(0, 10)) {
          state.account = wallet.account;
          // state.jwt = wallet.jwt;
          // state.sign_phrase = wallet.sign_phrase;
          // state.expired = wallet.expired
          // setSentryWallet(state.account)
        // }
      }
    }
  },
  actions: {
    async login({commit}, payload) {
      commit('login', payload)
    },
    logOut({commit}, needReload = true) {
      commit('logOut');
      if(needReload) window.location = '/'
    },
  }
}
