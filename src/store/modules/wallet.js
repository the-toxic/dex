function updateLocalStorage(data) {
  const wallet = JSON.parse(window.localStorage.getItem('wallet'));
  window.localStorage.setItem('wallet', JSON.stringify({...wallet, ...data}))
}

export default {
  namespaced: true,
  state: {
    sign_phrase: '', // fill after sign request
    account: '',
    jwt: '',
    refresh: '',
    expired: null,
    providerName: ''
  },
  getters: {
    account: state => state.account,
    jwt: state => state.jwt,
    sign_phrase: state => state.sign_phrase,
    expired: state => state.expired,
    providerName: state => state.providerName
  },
  mutations: {
    login(state, payload) {
      state.account = payload.account
      state.jwt = payload.jwt
      state.refresh = payload.refresh
      state.expired = payload.expired
      state.providerName = payload.providerName
      window.localStorage.setItem('wallet', JSON.stringify(payload))
      // setSentryWallet(state.account)
    },
    setSign(state, payload) {
      state.sign_phrase = payload
      updateLocalStorage({sign_phrase: payload})
    },
    logOut(state) {
      state.sign_phrase = ''
      state.account = ''
      state.jwt = ''
      state.refresh = ''
      state.expired = null
      state.providerName = ''
      window.localStorage.removeItem('wallet')
      // unsetSentryWallet()
    },
    loginWithLocalStorage(state) {
      if(window.localStorage.getItem('wallet')) {
        const wallet = JSON.parse(window.localStorage.getItem('wallet'));
        // if(wallet.expired > +(+new Date()).toString().slice(0, 10)) {
          state.sign_phrase = wallet.sign_phrase;
          state.account = wallet.account;
          state.jwt = wallet.jwt;
          state.refresh = wallet.refresh;
          state.expired = wallet.expired
          state.providerName = wallet.providerName
          // setSentryWallet(state.account)
        // }
      }
    }
  },
  actions: {
    async login({commit}, payload) {
      // const {data} = await tokensaleApi.signIn(payload)
      // if(data.success) {
      commit('login', payload)
      // }
      // return data
    },
    async sign(store, payload) {
      store.commit('setSign', payload)
    },
    logOut({commit}, needReload = true) {
      commit('logOut');
      if(needReload) {
        // if(window.location.pathname.includes('mint')) {
        window.location.reload()
        // }
        // window.location = '/'
      }
    },
  }
}
