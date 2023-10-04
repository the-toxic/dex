import { defineStore } from "pinia";
import { fetchExchanges, fetchHistoryTable, fetchPairInfo } from "@/api";
import { needInvert } from "@/helpers/mixins";
import { useMainStore } from "@/store/mainStore";
const mainStore = () => useMainStore()

const sessionId = Math.random().toString(36).slice(2, 18);
const getDefaultState = () => {
  return {
    activeSymbol: null,
    pairInfo: null,
    lastTXs: [],
    similarityPools: [],
    exchangesList: {},
  }
}
const invertAmounts = (txs) => txs.map(i => {
  const temp0 = i.amount_token0
  i.amount_token0 = i.amount_token1
  i.amount_token1 = temp0
  return i
})

export const useChartStore = defineStore('chart', {
	state: () => ({
    sessionId,
    ...getDefaultState()
  }),
	getters: {
    // activeSymbol: state => state.activeSymbol,
    // pairInfo: state => state.pairInfo,
    // sessionId: state => state.sessionId,
    chainName: state => (!mainStore().chains || !state.activeSymbol) ? '' : mainStore().chains[state.activeSymbol.chain_id]['name'],
    exchange: state => state.activeSymbol?.exchange || '',
    needInvert: state => state.activeSymbol?.need_invert || false,
    leftToken: state => state.activeSymbol ? state.activeSymbol.symbol.split('/')[0] : '',
    rightToken: state => state.activeSymbol ? state.activeSymbol.symbol.split('/')[1]: '',
    // lastTXs: state => state.lastTXs,
    lastPrice: state => state.lastTXs.length ? (state.lastTXs[0].amount_token1 / state.lastTXs[0].amount_token0) : 0
	},
	actions: {
    async setActiveSymbol(payload) {
      this.activeSymbol = payload
    },
    async getPairInfo(pairId) {
      const {success, result} = await fetchPairInfo(pairId)
      if(!success || !result) return

      if(needInvert(result.token0.symbol, result.token1.symbol)) {
        const  oldToken0 = result.token0
        result.token0 = result.token1
        result.token1 = oldToken0
      }
      this.pairInfo = {...this.pairInfo, ...result}
      return result
    },
    async loadHistoryTable({pair_id, chain_id}) {
      const {success, result} = await fetchHistoryTable({pair_id, chain_id})
      if(success && result?.length) {
        if(!this.activeSymbol) console.error('Call loadHistoryTable before init activeSymbol')
        if(this.activeSymbol?.need_invert)
          this.lastTXs = invertAmounts(result)
        else
          this.lastTXs = result
      }
    },
    async addNewTx(newTx) {
      this.lastTXs.unshift(newTx) // add to start array
      // if(this.lastTXs.length > 1000) { this.lastTXs = this.lastTXs.slice(0, 1000) }
    },
    async loadOldTXs() {
      const lastTx = this.lastTXs[this.lastTXs.length - 1]
      const {success, result} = await fetchHistoryTable({
        chain_id: this.activeSymbol.chain_id,
        pair_id: this.activeSymbol.pair_id,
        block_id: lastTx['block_id']
      })
      if(success && result?.length) {
        // проходимся по результату и если в блоке есть та-же tx или свежее, чем последняя в сторе, образеем их
        let data = result.filter(item => {
          if(lastTx.block_id !== item.block_id) return true
          return (lastTx.tx !== item.tx && lastTx.date > item.date)
        })

        if(this.activeSymbol.need_invert)
          data = invertAmounts(data)

        this.lastTXs.push(...data) // add to end array
      }
    },
    async loadExchanges() {
      const {success, result} = await fetchExchanges()
      if(success && Object.keys(result)?.length) {
        Object.keys(result).forEach(idx => {
          result[idx].title = result[idx].title.trim().replaceAll(':', '')
        })
        // window.exchanges = list
        this.exchangesList = result
      }
    },
    resetState () {
      Object.assign(this, getDefaultState()) // todo this вероятно не заработает
    }
	}
})
