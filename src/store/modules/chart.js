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
    pairInfo: state => state.pairInfo,
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
      } else if(type === 'addToStart') {
        state.lastTXs.unshift(data) // add to start array
        // todo обрезать только если юзер не скроллил (до последней), иначе при скролле может удалить только что загруженные
        state.lastTXs = state.lastTXs.slice(0, 1000)
      } else if(type === 'addToEnd') {
        state.lastTXs.push(...data) // add to end array
      }
      if(state.lastTXs.length >= 1000) {
        console.log('Limit 1k rows')
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
      return result
    },
    async loadHistoryTable({commit}, {pair_id}) {
      const {success, result} = await fetchHistoryTable({pair_id})
      if(success && result?.length) {
        commit('updateLastTxs', {type: 'set', data: result})
      }
    },
    async addNewTx({commit, state}, newTx) {
      newTx.tx_id = state.lastTXs[0]['tx_id'] + 1 // так не совсем правильно, но схема рабочая
      commit('updateLastTxs', {type: 'addToStart', data: newTx})
    },
    async loadOldTXs({state, commit}) {
      const {success, result} = await fetchHistoryTable({
        pair_id: state.activeSymbol.pair_id,
        tx_id: state.lastTXs[state.lastTXs.length - 1]['tx_id']
      })
      if(success && result?.length) {
        commit('updateLastTxs', {type: 'addToEnd', data: result})
      }
    },
  }
}
