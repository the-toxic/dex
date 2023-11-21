<template>
  <RecycleScroller v-if="activeSymbol"
    :item-size="30"
    key-field="tx"
    :items="rows"
    class="txsTable">

    <template #before>
      <div class="txsTableTd">Date</div>
      <div class="txsTableTd">Type</div>
      <div class="txsTableTd">Price</div>
      <div class="txsTableTd">{{ leftToken }}</div>
      <div class="txsTableTd">{{ rightToken }}</div>
      <div class="txsTableTd" style="flex-grow: 2">Aggregator</div>
      <div class="txsTableTd">Maker</div>
      <div class="txsTableTd">Receiver</div>
      <div class="txsTableTd">Actions</div>
    </template>

    <template #after>
      <div v-if="loading" class="text-center flex-fill"><v-skeleton-loader type="table-tbody" /> <v-skeleton-loader type="table-tbody" /></div>
      <div v-else-if="!loading && !rows.length" class="text-center flex-fill">No activity</div>
      <div v-if="!loading && rows.length" v-intersect="infiniteScrolling" class="text-center flex-fill">
        <v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" />
      </div>
    </template>

    <template v-slot="{ item }" v-if="!loading && rows.length">
      <div class="txsTableTd" :class="item.type === 'buy' ? 'buyTd' : 'sellTd'">{{ item.parsedDate }}</div>
      <div class="txsTableTd text-uppercase" :class="item.type === 'buy' ? 'buyTd' : 'sellTd'">{{ item.type }}</div>
      <div class="txsTableTd" :class="item.type === 'buy' ? 'buyTd' : 'sellTd'">{{ formatNumber(item.parsedPrice) }}</div>
      <div class="txsTableTd" :class="item.type === 'buy' ? 'buyTd' : 'sellTd'">{{ formatNumber(item.amount_token0) }}</div>
      <div class="txsTableTd" :class="item.type === 'buy' ? 'buyTd' : 'sellTd'">{{ formatNumber(item.amount_token1) }}</div>
      <div class="txsTableTd text-center" style="flex-grow: 2">
        <a v-if="item.router.address" :href="`${blockchainDomain}/address/${item.router.address}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ item.router.title }}</a>
        <span v-else>{{ item.router.title }}</span>
      </div>
      <div class="txsTableTd"><a :href="`${blockchainDomain}/address/${item.maker}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.maker) }}</a></div>
      <div class="txsTableTd"><a :href="`${blockchainDomain}/address/${item.receiver}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.receiver) }}</a></div>
      <div class="txsTableTd"><a :href="`${blockchainDomain}/tx/${item.tx}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">Show Tx</a></div>
    </template>
  </RecycleScroller>

<!--  <v-simple-table v-if="activeSymbol" fixed-header height="1000" class="myTable text-center">
    <thead>
    <tr>
      <th class="text-center">Date</th>
      <th class="text-center">Type</th>
      <th class="text-center">Price</th>
      <th class="text-center">{{ leftToken }}</th>
      <th class="text-center">{{ rightToken }}</th>
      <th class="text-center">Aggregator</th>
      <th class="text-center">Maker</th>
      <th class="text-center">Receiver</th>
      <th class="text-center">Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="loading"><td colspan="9"><v-skeleton-loader type="table-tbody" /></td></tr>
    <tr v-else-if="!loading && !rows.length"><td colspan="9">No activity</td></tr>
    <tr v-for="(item, idx) in rows" :key="idx"
        :class="{'buy': item.type === 'buy', 'sell': item.type === 'sell'}" >
      <td>{{ item.parsedDate }}</td>
      <td class="text-uppercase">{{ item.type }}</td>
      <td>{{ formatNumber(item.parsedPrice) }}</td>
      <td>{{ formatNumber(item.amount_token0) }}</td>
      <td>{{ formatNumber(item.amount_token1) }}</td>
      <td>
        <a v-if="item.router.address" :href="`https://bscscan.com/address/${item.router.address}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ item.router.title }}</a>
        <span v-else>{{ item.router.title }}</span>
      </td>
      <td><a :href="`https://bscscan.com/address/${item.maker}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.maker) }}</a></td>
      <td><a :href="`https://bscscan.com/address/${item.receiver}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.receiver) }}</a></td>
      <td><a :href="`https://bscscan.com/tx/${item.tx}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">Show Tx</a></td>
    </tr>
    <tr v-if="rows.length && rows.length < 1000">
      <td colspan="9">
        <div v-intersect="infiniteScrolling" class="text-center">
          <v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" />
        </div>
      </td>
    </tr>
    </tbody>
  </v-simple-table>-->
</template>

<script>
import { mapState } from "pinia";
import { useChartStore } from "@/store/chartStore";
const chartStore = useChartStore()

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { shortAddress, formatNumber } from "@/helpers/mixins";


export default {
  name: "TableHistory",
  data() {return {
    loading: false,
		// rows: []
  }},
  async created() {},
  computed: {
    ...mapState(useChartStore, {activeSymbol: 'activeSymbol', leftToken: 'leftToken', rightToken: 'rightToken',
																					lastTXs: 'lastTXs', exchangesList: 'exchangesList'}),
    rows() {
			if(this.loading) return []

      const items = Object.assign([], this.lastTXs)
      // const items = [...this.lastTXs]
      return items.map(item => {
        item.parsedPrice = formatNumber(+item.amount_token1/+item.amount_token0)
        item.parsedDate = new Date((item.date + this.tzOffset) * 1000).toISOString().slice(0, 19).split('T').join(' ')
        item.router = this.exchangesList.hasOwnProperty(item.router_id) ? this.exchangesList[item.router_id] : { title: '—', address: null }
        return item
      })
      // return this.lastTXs
    },
    tzOffset: () => -(new Date().getTimezoneOffset()) * 60,
		blockchainDomain() {
			return this.activeSymbol.type === 'BSC' ? 'https://bscscan.com' : 'https://etherscan.io'
		}
  },
  watch: {
    async activeSymbol(newVal, oldVal) {
      if(!newVal) return
      this.loading = true
      await chartStore.loadHistoryTable({
				chain_id: newVal.chain_id,
				pair_id: newVal.pair_id
			})
      this.loading = false
    },
		// lastTXs(newVal, oldVal) {
		// 	console.log('lastTXs', newVal.length, oldVal.length)
		// 	const result = this.lastTXs.map(item => {
		// 		item.parsedPrice = formatNumber(+item.amount_token1/+item.amount_token0)
		// 		item.parsedDate = new Date((item.date + this.tzOffset) * 1000).toISOString().slice(0, 19).split('T').join(' ')
		// 		item.router = this.exchangesList.hasOwnProperty(item.router_id) ? this.exchangesList[item.router_id] : { title: '—', address: null }
		// 		return item
		// 	})
		// 	this.rows = result
		// }
  },
  methods: {
    shortAddress, formatNumber,
    infiniteScrolling(isIntersecting, entries, observer) {
      if (entries[0].isIntersecting) {
        console.log('Load Oldest TXs on Scroll...')
        chartStore.loadOldTXs().then()
      }
    },
  }
}
</script>

<style>
.txsTable {
  height: 700px;
}
.buyTd {
	color: #27a69a;
}
.sellTd {
	color: #f0534f;
}

.vue-recycle-scroller__item-wrapper { /* table */
  min-width: 1200px;
}
.vue-recycle-scroller__slot { /* thead tr */
  display: flex;
  padding: 6px 12px;
  background: #2d3244;
  font-weight: bold;
  margin-bottom: 10px;
}
.vue-recycle-scroller__item-view { /* tbody tr */
  display: flex;
  padding: 3px 12px;
}
.vue-recycle-scroller__item-view.hover {
	background: #0f171e;
}
.vue-recycle-scroller__item-view a:hover {
	text-decoration: underline !important;
}
.txsTableTd { /* td */
  flex: 1;
  white-space: nowrap;
  text-align: center;
}

</style>
