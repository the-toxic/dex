<template>

  <div class="d-flex justify-center align-center flex-wrap pa-4" style="background: #141d26">
    <!-- <input type="text" ref="datepickerBuy" placeholder="Period of Buy tokens" class="datePickerInput mr-4" />-->
    <Datepicker pickerName="datepickerBuy" placeholder="Period of Buy tokens" :initPeriod="periodBuy" @update="onPeriodChange('buy', $event)" class="mr-4" />
    <Datepicker pickerName="datepickerSell" placeholder="Period of Sell tokens" :initPeriod="periodSell"  @update="onPeriodChange('sell', $event)" class="mr-4" />

    <v-spacer />
    <!-- <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>-->
  </div>

	<v-text-field v-model="searchInput" label="Search by Wallets..." prepend-inner-icon="mdi-magnify" hide-details clearable @click:clear="searchInput = ''" density="compact" />
	<div class="overflow-x-auto">
		<v-data-table-server style="min-width: 1300px"
			v-model:page="page"
			v-model:items-per-page="per_page"
			v-model:sort-by="sortBy"
			:headers="headers"
			:items-length="totalItems"
			:items="items"
			:loading="loading"
			class="elevation-1 fs14" density="compact"
			:items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"
			@update:options="loadItems"
		> <!-- All Events update: https://vuetifyjs.com/en/api/v-data-table/#events -->
<!--			<template v-slot:column.wallet="{ column }"><div class="mx-n4 fill-height pt-11 border">{{ column.title }}</div></template>-->
<!--			<template v-slot:column.profit="{ column }"><div class="mx-n4 fill-height pt-11 border">{{ column.title }}</div></template>-->
<!--			<template v-slot:column.roi="{ column }"><div class="mx-n4 fill-height pt-11 border">{{ column.title }}</div></template>-->
			<template v-slot:column.buys="{ column }"><div class="mx-n4 fill-height pt-2" style="background: #334c35">{{ column.title }}</div></template>
			<template v-slot:column.sells="{ column }"><div class="mx-n4 fill-height pt-2" style="background: #693131">{{ column.title }}</div></template>

			<template v-slot:item.wallet="{ item }"><v-btn @click="$clipboard(item.wallet)" rounded variant="text" density="comfortable" :active="false" class="text-none">{{ shortAddress(item.wallet) }}</v-btn></template>
			<template v-slot:item.profit="{ item }">
        <v-chip :color="item.profit > 0 ? 'success': (item.profit < 0 ? 'error' : 'white')" size="small">
          {{ toNumber(item.profit) }}
        </v-chip>
      </template>
			<template v-slot:item.roi="{ item }">
        <v-chip :color="item.roi > 0 ? 'success': (item.roi < 0 ? 'error' : 'white')" size="small">
					{{ item.roi > 0 ? '+' : (item.roi < 0 ? '-' : '') }} {{ formatNumber(Math.abs(item.roi)) || 0 }}%
        </v-chip>
      </template>
			<template v-slot:item.buy_txs="{ item }">{{ toNumber(item.buy_txs) }}</template>
			<template v-slot:item.buy_amount="{ item }">{{ !item.buy_txs ? '-' : formatBigNumber(item.buy_amount) }}</template>
			<template v-slot:item.buy_price="{ item }">{{ !item.buy_txs ? '-' : formatNumber(item.buy_total / item.buy_amount) }}</template>
			<template v-slot:item.buy_total="{ item }">{{ !item.buy_txs ? '-' : formatNumber(item.buy_total) }}</template>

			<template v-slot:item.sell_txs="{ item }">{{ toNumber(item.sell_txs) }}</template>
			<template v-slot:item.sell_amount="{ item }">{{ !item.sell_txs ? '-' : formatBigNumber(item.sell_amount) }}</template>
			<template v-slot:item.sell_price="{ item }">{{ !item.sell_txs ? '-' : formatNumber(item.sell_total / item.sell_amount) }}</template>
			<template v-slot:item.sell_total="{ item }">{{ !item.sell_txs ? '-' : formatNumber(item.sell_total) }}</template>

			<template v-slot:tfoot>
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="1" class="text-right">Total</td>
					<td>
						<v-chip :color="totalInfo.profit > 0 ? 'success': (totalInfo.profit < 0 ? 'error' : 'white')" size="small">
							{{ totalInfo.profit > 0 ? '+' : (totalInfo.profit < 0 ? '-' : '') }} {{ formatNumber(Math.abs(totalInfo.profit)) || 0 }}
						</v-chip>
					</td>
					<td>
						<v-chip :color="totalInfo.roi > 0 ? 'success': (totalInfo.roi < 0 ? 'error' : 'white')" size="small">
							{{ totalInfo.roi > 0 ? '+' : (totalInfo.roi < 0 ? '-' : '') }} {{ formatNumber(Math.abs(totalInfo.roi)) || 0 }}%, avg
						</v-chip>
					</td>
					<td>{{ formatNumber(totalInfo.buy_txs) || 0 }}</td>
					<td>{{ formatBigNumber(totalInfo.buy_amount) || 0 }}</td>
					<td>{{ formatNumber(totalInfo.buy_price) || 0 }}</td>
					<td>{{ formatNumber(totalInfo.buy_total) || 0 }}</td>
					<td>{{ formatNumber(totalInfo.sell_txs) || 0 }}</td>
					<td>{{ formatBigNumber(totalInfo.sell_amount) || 0 }}</td>
					<td>{{ formatNumber(totalInfo.sell_price) || 0 }}</td>
					<td>{{ formatNumber(totalInfo.sell_total) || 0 }}</td>
				</tr>
				</tfoot>
			</template>
		</v-data-table-server>
	</div>
</template>

<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchDexAnalyzeGroupTxs } from "@/api";
import { formatBigNumber, formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import Datepicker from "@/components/Datepicker.vue";
import { mapState } from "pinia";
import { useChartStore } from "@/store/chartStore";

export default {
  name: 'DexAnalyzeTxsGroupTable',
  components: { Datepicker, VDataTableServer },
  props: {
    chainId: Number,
    pairId: Number
  },
  data: () => ({
    loading: false,
    per_page: 20,
		page: 1,
		sortBy: [{key: 'profit', order: 'desc'}],
    headers: [
			[
				{ title: 'Wallet', key: 'wallet', align: 'center', sortable: false, rowspan: 2 },
				{ title: 'Profit', key: 'profit', align: 'center', rowspan: 2 },
				{ title: '% ROI', key: 'roi', align: 'center', rowspan: 2 },
				{ title: 'Buys', key: 'buys', align: 'center', sortable: false, colspan: 4, color: 'bg-green' },
				{ title: 'Sells', key: 'sells', align: 'center', sortable: false, colspan: 4 },
			],
			[
				{ title: 'TXs', key: 'buy_txs', align: 'center' },
				{ title: 'Amount', key: 'buy_amount', align: 'center' },
				{ title: 'Price', key: 'buy_price', align: 'center' },
				{ title: 'Total', key: 'buy_total', align: 'center' },

				{ title: 'TXs', key: 'sell_txs', align: 'center' },
				{ title: 'Amount', key: 'sell_amount', align: 'center' },
				{ title: 'Price', key: 'sell_price', align: 'center' },
				{ title: 'Total', key: 'sell_total', align: 'center' },
    	]
		],
		searchInput: '',
    items: [],
    totalItems: 0,
		totalInfo: {},

    // periodBuy: [ new Date('2022-02-01 00:00'), new Date('2022-02-07 23:59')]
    periodBuy: [
			moment().subtract(7, 'days').startOf("day").toDate(),
      moment().endOf("day").toDate()
    ],
    periodSell: [/*new Date('2022-02-11 00:00'), new Date('2022-02-12 23:59')*/],
  }),
	async created() {
		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)

		this.setTokensToTableHeader()

		if(this.$route['query']['periodBuy']) {
			const [from, to] = this.$route['query']['periodBuy'].split(' - ')
			this.periodBuy = [new Date(from), new Date(to)]
		}
		if(this.$route['query']['periodSell']) {
			const [from, to] = this.$route['query']['periodSell'].split(' - ')
			this.periodSell = [new Date(from), new Date(to)]
		}
	},
	watch: {
    chainId(newVal, oldVal) {
      if(!oldVal) return
      this.loadItems()
    },
    pairId(newVal, oldVal) {
      this.loadItems()

			this.setTokensToTableHeader()
    },
		searchInput(newVal) {
			this.debouncedFn()
		},
	},
	computed: {
		...mapState(useChartStore, ['leftToken', 'rightToken', 'explorerDomain']),
	},
	methods: {
		shortAddress, formatNumber, formatBigNumber, toCurrency, toNumber,

    async loadItems () {
      if(!this.chainId || !this.pairId) return
			const params = {
				chain_id: this.chainId,
				pair_id: this.pairId,
				page: this.page,
				per_page: this.per_page,
				sortBy: this.sortBy.length ? this.sortBy : [{key: 'profit', order: 'desc'}],
				search: this.searchInput.trim(),
				buy_period_start: this.periodBuy[0] ? moment(this.periodBuy[0]).format("YYYY-MM-DD HH:mm:ss") : '',
				buy_period_end: this.periodBuy[1] ? moment(this.periodBuy[1]).format("YYYY-MM-DD HH:mm:ss") : '',
				sell_period_start: this.periodSell[0] ? moment(this.periodSell[0]).format("YYYY-MM-DD HH:mm:ss") : '',
				sell_period_end: this.periodSell[1] ? moment(this.periodSell[1]).format("YYYY-MM-DD HH:mm:ss") : '',
			};

			setTimeout(() => {
				const urlQuery = {}
				if(params.buy_period_start) urlQuery.periodBuy = params.buy_period_start +' - '+ params.buy_period_end
				if(params.sell_period_start) urlQuery.periodSell = params.sell_period_start +' - '+ params.sell_period_end
				this.$router.replace({
					...this.$route,
					query: urlQuery,
				})
			}, 500)

			this.loading = true
			const { data } = await fetchDexAnalyzeGroupTxs(params)
      this.loading = false
      if(data.success) {
        const items = data.result.items.map(i => {
          if(i['buy_txs'] === 0 || i['sell_txs'] === 0) {
            i['roi'] = 0
            i['profit'] = 0
          }
          return i
        })
        // items.sort((a,b) => { // filter by TX count, DESC
        //   if(a.profit > b.profit) return -1
        //   if(a.profit < b.profit) return 1
        //   return 0
        // })
        this.items = items
        this.totalItems = data.result.totalItems || 0 // data.result.totalItems
        this.totalInfo = data.result.total ||  {} // data.result.total
      }
    },
		setTokensToTableHeader() {
			this.headers[0].find(i => i.key === 'profit').title = 'Profit, '+this.rightToken.slice(0,5)
			this.headers[1].find(i => i.key === 'buy_amount').title = 'Amount, '+this.leftToken.slice(0,5)
			this.headers[1].find(i => i.key === 'buy_price').title = 'Price, '+this.rightToken.slice(0,5)
			this.headers[1].find(i => i.key === 'sell_amount').title = 'Amount, '+this.leftToken.slice(0,5)
			this.headers[1].find(i => i.key === 'sell_price').title = 'Price, '+this.rightToken.slice(0,5)
		},
    onPeriodChange(type, $event) {
      console.log('onPeriodChange')
      if(type === 'buy') {
        this.periodBuy = $event;
      } else {
        this.periodSell = $event;
      }

      this.loadItems()
    }
  },
}
</script>
