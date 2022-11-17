import { fetchExchanges, fetchHistoryTable, fetchPairInfo } from "@/api";

const sessionId = Math.random().toString(36).slice(2, 18);

const getDefaultState = () => {
  return {
    activeSymbol: null,
    pairInfo: null,
    lastTXs: [],
    sessionId,
    exchangesList: {},
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    activeSymbol: state => state.activeSymbol,
    pairInfo: state => state.pairInfo,
    sessionId: state => state.sessionId,
    exchangesList: state => state.exchangesList,
    needInvert: state => state.activeSymbol?.need_invert || false,
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
        // if(state.lastTXs.length > 1000) {
        //   state.lastTXs = state.lastTXs.slice(0, 1000)
        // }
      } else if(type === 'addToEnd') {
        state.lastTXs.push(...data) // add to end array
      }
    },
    setSessionId(state, payload) {
      state.sessionId = payload
    },
    setExchanges(state, payload) {
      state.exchangesList = payload
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
    async loadHistoryTable({commit}, {pair_id, chain_id}) {
      const {success, result} = await fetchHistoryTable({pair_id, chain_id})
      if(success && result?.length) {
        commit('updateLastTxs', {type: 'set', data: result})
      }
    },
    async addNewTx({commit, state}, newTx) {
      // newTx.tx_id = state.lastTXs[0]['tx_id'] + 1 // наверно эта строка не нужна, если tx_id больше нет
      commit('updateLastTxs', {type: 'addToStart', data: newTx})
    },
    async loadOldTXs({state, commit}) {
      const lastTx = state.lastTXs[state.lastTXs.length - 1]
      const {success, result} = await fetchHistoryTable({
        chain_id: state.activeSymbol.chain_id,
        pair_id: state.activeSymbol.pair_id,
        block_id: lastTx['block_id']
      })
      if(success && result?.length) {
        // проходимся по результату и если в блоке есть та-же tx или свежее, чем последняя в сторе, образеем их
        const data = result.filter(item => {
          if(lastTx.block_id !== item.block_id) return true
          return (lastTx.tx !== item.tx && lastTx.date > item.date)
        })
        commit('updateLastTxs', {type: 'addToEnd', data})
      }
    },
    async loadExchanges({commit}) {
      const {success, result} = await fetchExchanges()
      if(success && Object.keys(result)?.length) {
        Object.keys(result).forEach(idx => {
          result[idx].title = result[idx].title.trim().replaceAll(':', '')
        })
        // window.exchanges = list
        commit('setExchanges', result)
      }
    },
  }
}
