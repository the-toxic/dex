<template>
  <div class="d-flex justify-space-between align-center flex-wrap px-4 py-3 rounded-t bg-surface2" style="gap: 10px;">
    <Datepicker pickerName="datepickerPeriod" placeholder="Period" :initPeriod="filter.period" @update="onPeriodChange($event)" />
    <div>
      Type:
      <v-btn-toggle v-model="filter.type" density="comfortable" variant="outlined">
        <v-btn :value="0" class="text-none">All</v-btn>
        <v-btn :value="1" color="success" class="text-none">Adds</v-btn>
        <v-btn :value="-1" color="error" class="text-none">Removes</v-btn>
      </v-btn-toggle>
    </div>
    <v-switch label="Show Creator TXs" v-model="filter.isCreator" :true-value="1" :false-value="0" hide-details density="compact" color="primary" class="flex-grow-0" />
    <div style="width: 250px">
      <v-text-field v-model="filter.search" label="Search" placeholder="" clearable @click:clear="filter.search = ''"
        density="compact" prepend-inner-icon="mdi-magnify" hide-details rounded variant="outlined" />
    </div>
  </div>
  <v-divider />
  <v-data-table-server
    v-model:items-per-page="per_page"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items-length="totalItems"
    :items="items"
    :loading="loading"
    @update:options="loadItems"
    class="elevation-1 fs14 mb-16"
		density="comfortable"
    :items-per-page-options="[20,50,100]"
  >
    <template v-slot:item.maker="{ item }">
			<LabelAddress link copy :to="{name: 'Address', params: {id: item.maker.address}}" :address="item.maker" target="_blank" />
    </template>
    <template v-slot:item.type="{ item }"><v-chip :color="item.token0_amount > 0 ? 'success':'error'" class="text-uppercase" size="small">{{ item.token0_amount > 0 ? "Adds" : 'Removes' }}</v-chip></template>
    <template v-slot:item.token0_amount="{ item }">{{ formatNumber(Math.abs(item.token0_amount), true) }}</template>
    <template v-slot:item.token0_total="{ item }">${{ formatNumber(item.token0_total, true) }}</template>
    <template v-slot:item.token1_amount="{ item }">{{ formatNumber(Math.abs(item.token1_amount), true) }}</template>
    <template v-slot:item.token1_total="{ item }">${{ formatNumber(item.token1_total, true) }}</template>
    <template v-slot:item.total="{ item }">${{ formatNumber(item.total, true) }}</template>

    <template v-slot:tfoot>
      <tfoot>
      <tr class="text-surface-variant text-center">
        <td colspan="4" class="text-right">Total</td>
        <td>{{ formatNumber(Math.abs(totalInfo.token0_amount), true) }}</td>
        <td>${{ formatNumber(totalInfo.token0_total, true) }}</td>
        <td>{{ formatNumber(Math.abs(totalInfo.token1_amount), true) }}</td>
        <td>${{ formatNumber(totalInfo.token1_total, true) }}</td>
        <td>${{ formatNumber(totalInfo.total, true) }}</td>
      </tr>
      </tfoot>
    </template>
  </v-data-table-server>
</template>

<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { fetchDexLiquidityTxs } from "@/api";
import { API_DOMAIN, formatBigNumber, formatNumber, shortAddress, toCurrency } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import Datepicker from "@/components/Datepicker.vue";
import { useMainStore } from "@/store/mainStore";
import { mapState } from "pinia";
import { useChartStore } from "@/store/chartStore";
import LabelAddress from "@/components/UI/LabelAddress.vue";

export default {
  name: 'DexPairLiquidityTable',
  components: { LabelAddress, Datepicker },
  props: {
    pairId: {
      type: Number,
      required: true
    },
    chainId: {
      type: Number,
      required: true
    },
    pairInfo: {
      type: Object,
      required: true
    }
  },
  data() { return {
		API_DOMAIN,
    loading: false,
    per_page: 20,
		page: 1,
		sortBy: [{key: 'dttm', order: 'desc'}],
		network: 'bsc', // ether | bsc
    headers: [
      { title: 'Date', key: 'dttm', align: 'center' },
      { title: 'Ago', key: 'ago', align: 'center', sortable: false },
      { title: 'Maker', key: 'maker', align: 'center', sortable: false },
      { title: 'Type', key: 'type', align: 'center', sortable: false },
      { title: 'Token0 Amount', key: 'token0_amount', align: 'center' },
      { title: 'Token0 Amount, $', key: 'token0_total', align: 'center' },
      { title: 'Token1 Amount', key: 'token1_amount', align: 'center' },
      { title: 'Token1 Amount, $', key: 'token1_total', align: 'center' },
			{ title: 'Total Amount, $', key: 'total', align: 'center' },
    ],
    items: [],
    totalItems: 999,
		totalInfo: {},

		filter: {
      search: '',
			type: 0,
			isCreator: 0,
      period: [
        null, // moment().subtract(7, 'days').startOf("day").toDate(),
        null, // moment().endOf("day").toDate()
      ],
		},
  }},
	async created() {
		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)

    this.updateHeaders()
	},

	watch: {
    pairInfo(newVal, oldVal) { // on select new pair in search
      if(!newVal || !oldVal) return
      this.updateHeaders()
      this.loadItems()
    },
    'filter.type'(newVal) {
      this.loadItems()
    },
    'filter.isCreator'(newVal) {
      this.loadItems()
    },
		'filter.search'(newVal) {
			this.debouncedFn()
		},
	},
	computed: {
		...mapState(useMainStore, {chains: 'chains'}),
		...mapState(useChartStore, {lastPrice: 'lastPrice', nativeWrappedSymbol: 'nativeWrappedSymbol', needInvert: 'needInvert'}),
		// rows() {
		// 	return this.items.map(item => {
		// 		item.ago = moment(item.dttm).fromNow() //'1y 5m 1d 2h'
		// 		return item
		// 	})
		// },
    nativeSymbolPrice() {
      return this.chains[this.chainId]['native_symbol_price'] || 1
    },
	},
  methods: {
		shortAddress, formatNumber, formatBigNumber, toCurrency,

		async loadItems () {
      this.loading = true
			this.items = []
      const data = await fetchDexLiquidityTxs({
				page: this.page,
				per_page: this.per_page,
				sortBy: this.sortBy,
				search: this.filter.search.trim(),
        pair_id: this.pairId,
        chain_id: this.chainId,
        direction: this.filter.type,
        is_creator: this.filter.isCreator,
        from_dttm: this.filter.period[0] ? moment(this.filter.period[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        to_dttm: this.filter.period[1] ? moment(this.filter.period[1]).format("YYYY-MM-DD HH:mm:ss") : '',
			})
      this.loading = false

      if(data.success) {
				this.items = data.result.items.map(item => {
					item.ago = moment(item.dttm).fromNow() //'1y 5m 1d 2h'
					if(this.needInvert) {
						const oldAmount0 = item.token0_amount
						item.token0_amount = item.token1_amount
						item.token1_amount = oldAmount0
					}
          item.token0_total = this.pairInfo.token0.symbol === this.nativeWrappedSymbol
            ? (Math.abs(item.token0_amount) * this.nativeSymbolPrice) // if coin
            : (this.pairInfo.token1.is_stable
              ? (Math.abs(item.token0_amount) * this.lastPrice) // if right stable
              : (Math.abs(item.token0_amount) * this.nativeSymbolPrice * this.lastPrice)) // other

          item.token1_total = this.pairInfo.token1.is_stable
            ? (Math.abs(item.token1_amount))
            : (this.pairInfo.token1.symbol === this.nativeWrappedSymbol
              ? (Math.abs(item.token1_amount) * this.nativeSymbolPrice)
              : 0)
          item.total = item.token0_total + item.token1_total

          return item
        })
				console.log(this.items[1].maker.entity.name)

				if(this.needInvert) {
					const oldAmount0 = data.result.total.token0_amount
					data.result.total.token0_amount = data.result.total.token1_amount
					data.result.total.token1_amount = oldAmount0
				}
				this.totalInfo = data.result.total
        this.totalInfo.token0_total =
          this.pairInfo.token0.symbol === this.nativeWrappedSymbol
            ? (Math.abs(this.totalInfo.token0_amount) * this.nativeSymbolPrice) // if coin
            : (this.pairInfo.token1.is_stable
              ? (Math.abs(this.totalInfo.token0_amount) * this.lastPrice) // if right stable
              : (Math.abs(this.totalInfo.token0_amount) * this.nativeSymbolPrice * this.lastPrice)) // other

        this.totalInfo.token1_total =
          this.pairInfo.token1.is_stable ? Math.abs(this.totalInfo.token1_amount)
            : (this.pairInfo.token1.symbol === this.nativeWrappedSymbol
            ? (Math.abs(this.totalInfo.token1_amount) * this.nativeSymbolPrice)
            : 0)
        this.totalInfo.total = this.totalInfo.token0_total + this.totalInfo.token1_total

				this.totalItems = data.result.totalItems
      }
    },

    updateHeaders() {
      this.headers.find(i => i.key === 'token0_amount').title = this.pairInfo.token0.symbol.slice(0,5) +' Amount'
      this.headers.find(i => i.key === 'token0_total').title = this.pairInfo.token0.symbol.slice(0,5) +' Amount, $'
      this.headers.find(i => i.key === 'token1_amount').title = this.pairInfo.token1.symbol.slice(0,5) +' Amount'
      this.headers.find(i => i.key === 'token1_total').title = this.pairInfo.token1.symbol.slice(0,5) +' Amount, $'
    },
    onPeriodChange($event) {
      this.filter.period = $event;
      this.loadItems()
    }
  },
}
</script>
