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
			v-model:items-per-page="itemsPerPage"
			v-model:sort-by="sortBy"
			v-model:page="page"
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
        <v-chip :color="item.roi > 0 ? 'success': (item.roi < 0 ? 'error' : 'white')" size="small">
          {{ toCurrency(item.profit) }}
        </v-chip>
      </template>
			<template v-slot:item.roi="{ item }">
        <v-chip :color="item.roi > 0 ? 'success': (item.roi < 0 ? 'error' : 'white')" size="small">
          {{ item.roi > 0 ? '+' : (item.roi < 0 ? '-' : '') }} {{ Math.round(Math.abs(item.roi)) || 0 }}%
        </v-chip>
      </template>
			<template v-slot:item.buy_txs="{ item }">{{ toNumber(item.buy.txs_count) }}</template>
			<template v-slot:item.buy_amount="{ item }">{{ !item.buy.txs_count ? '-' : formatBigNumber(item.buy.token0_amount) }}</template>
			<template v-slot:item.buy_price="{ item }">{{ !item.buy.txs_count ? '-' : formatNumber(item.buy.total / item.buy.token0_amount) }}</template>
			<template v-slot:item.buy_total="{ item }">{{ !item.buy.txs_count ? '-' : formatNumber(item.buy.total) }}</template>

			<template v-slot:item.sell_txs="{ item }">{{ toNumber(item.sell.txs_count) }}</template>
			<template v-slot:item.sell_amount="{ item }">{{ !item.sell.txs_count ? '-' : formatBigNumber(item.sell.token0_amount) }}</template>
			<template v-slot:item.sell_price="{ item }">{{ !item.sell.txs_count ? '-' : formatNumber(item.sell.total / item.sell.token0_amount) }}</template>
			<template v-slot:item.sell_total="{ item }">{{ !item.sell.txs_count ? '-' : formatNumber(item.sell.total) }}</template>

<!--			<template v-slot:tfoot>-->
<!--				<tfoot>-->
<!--				<tr class="text-surface-variant text-center">-->
<!--					<td colspan="1" class="text-right">Total</td>-->
<!--					<td>{{ toCurrency(totalInfo.profit) }}</td>-->
<!--					<td>-->
<!--						<v-chip :color="totalInfo.roi > 0 ? 'success': (totalInfo.roi < 0 ? 'error' : 'white')" size="small">-->
<!--							{{ totalInfo.roi > 0 ? '+' : (totalInfo.roi < 0 ? '-' : '') }} {{ Math.abs(totalInfo.roi) || 0 }}%, avg-->
<!--						</v-chip>-->
<!--					</td>-->
<!--					<td>{{ formatBigNumber(totalInfo.buy_amount) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.buy_price) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.buy_total) }}</td>-->
<!--					<td>{{ formatBigNumber(totalInfo.sell_amount) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.sell_price) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.sell_total) }}</td>-->
<!--				</tr>-->
<!--				</tfoot>-->
<!--			</template>-->
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
    itemsPerPage: 20,
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

    periodBuy: [
			new Date('2022-02-01 00:00'), new Date('2022-02-07 23:59')
			// '2022-02-01 00:00 - 2022-02-07 23:59', //moment().subtract(1, 'months').startOf("day").toDate(),
      // '2022-02-11 00:00 - 2022-02-12 23:59', // moment().endOf("day").toDate()
    ],
    periodSell: [new Date('2022-02-11 00:00'), new Date('2022-02-12 23:59')],
  }),
	async created() {
		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)
	},
	watch: {
    chainId(newVal, oldVal) {
      if(!oldVal) return
      this.loadItems()
    },
    pairId(newVal, oldVal) {
      this.loadItems()

			this.headers[1].find(i => i.key === 'buy_amount').title = 'Amount, '+this.leftToken
			this.headers[1].find(i => i.key === 'buy_price').title = 'Price, '+this.rightToken
			this.headers[1].find(i => i.key === 'sell_amount').title = 'Amount, '+this.leftToken
			this.headers[1].find(i => i.key === 'sell_price').title = 'Amount, '+this.rightToken
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
      this.loading = true
      const { data } = await fetchDexAnalyzeGroupTxs({
        chain_id: this.chainId,
        pair_id: this.pairId,
        page: this.page,
        per_page: this.itemsPerPage,
        sortBy: this.sortBy,
        search: this.searchInput.trim(),
        buy_period_start: this.periodBuy[0] ? moment(this.periodBuy[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        buy_period_end: this.periodBuy[1] ? moment(this.periodBuy[1]).format("YYYY-MM-DD HH:mm:ss") : '',
        sell_period_start: this.periodSell[0] ? moment(this.periodSell[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        sell_period_end: this.periodSell[1] ? moment(this.periodSell[1]).format("YYYY-MM-DD HH:mm:ss") : '',
      })
      this.loading = false
      if(data.success) {
        const items = Object.keys(data.result).map(key => {
          data.result[key]['wallet'] = key
          if(data.result[key]['buy']['txs_count'] === 0 || data.result[key]['sell']['txs_count'] === 0) {
            data.result[key]['roi'] = 0
            data.result[key]['profit'] = 0
          }
          return data.result[key]
        })
        items.sort((a,b) => { // filter by TX count, DESC
          if(a.profit > b.profit) return -1
          if(a.profit < b.profit) return 1
          return 0
        })
        this.items = items
        this.totalItems = 0 // data.result.totalItems
        this.totalInfo = {} // data.result.total
      }
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
