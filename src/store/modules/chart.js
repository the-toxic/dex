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
    lastTXs: state => state.lastTXs
  },
  mutations: {
    setSymbol(state, payload) {
      state.activeSymbol = payload
    },
    updateLastTxs(state, {type, data}) {
      if(type === 'set') {
        state.lastTXs = data
      } else {
        state.lastTXs.unshift(data) // add to start array
        state.lastTXs = state.lastTXs.slice(0, 50)
      }
    },
  },
  actions: {
    async setSymbol({commit}, payload) {
      commit('setSymbol', payload)
    },
    async setLastTXs({commit}, payload) {
      commit('updateLastTxs', {type: 'set', data: payload})
    },
    async pushLastTXs({commit}, payload) {
      commit('updateLastTxs', {type: 'push', data: payload})
    },
  }
}
