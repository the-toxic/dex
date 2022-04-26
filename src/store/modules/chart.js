export default {
  namespaced: true,
  state: {
    activeSymbol: null,
    lastPrice: 0,
    lastTXs: []
  },
  getters: {
    activeSymbol: state => state.activeSymbol,
    leftToken: state => state.activeSymbol.symbol.split('/')[0],
    rightToken: state => state.activeSymbol.symbol.split('/')[1],
  },
  mutations: {
    setSymbol(state, payload) {
      state.activeSymbol = payload
    },
  },
  actions: {
    async setSymbol({commit}, payload) {
      commit('setSymbol', payload)
    },
  }
}
