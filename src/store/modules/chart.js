import { fetchHistoryTable, fetchPairInfo } from "@/api";

const getDefaultState = () => {
  return {
    activeSymbol: null,
    pairInfo: null,
    lastTXs: []
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    activeSymbol: state => state.activeSymbol,
    // needInvert: state => state.activeSymbol.needInvert,
    leftToken: state => state.activeSymbol ? state.activeSymbol.symbol.split('/')[0] : '',
    rightToken: state => state.activeSymbol ? state.activeSymbol.symbol.split('/')[1]: '',
    lastTXs: state => state.lastTXs,
    lastPrice: state => state.lastTXs.length ? (state.lastTXs[0].amount_token1 / state.lastTXs[0].amount_token0) : 0
  },
  mutations: {
    setSymbol(state, payload) {
      state.activeSymbol = payload
    },
    setPairInfo(state, payload) {
      state.pairInfo = {...state.pairInfo, ...payload}
    },
    updateLastTxs(state, {type, data}) {
      if(type === 'set') {
        state.lastTXs = data
      } else {
        state.lastTXs.unshift(data) // add to start array
        state.lastTXs = state.lastTXs.slice(0, 50)
      }
    },
    resetState (state) {
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    async setSymbol({commit}, payload) {
      commit('setSymbol', payload)
    },
    async getPairInfo({commit}, pairId) {
      const {success, result} = await fetchPairInfo(pairId)
      if(!success || !result) return
      commit('setPairInfo', result)
      console.log('fetchPairInfo', result)
      return result
    },
    async getHistoryTable({commit}, payload) {
      const {success, result} = await fetchHistoryTable(payload)
      if(success && result?.length) {
        commit('updateLastTxs', {type: 'set', data: result})
      }
    },
    async pushLastTXs({commit}, payload) {
      commit('updateLastTxs', {type: 'push', data: payload})
    },
  }
}
