<template>

		<div class="d-flex justify-space-between align-center flex-wrap px-4 py-2" style="gap: 10px; background: #1a2633">
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
			:items="rows"
			:loading="loading"
			class="elevation-1 fs14  mb-32" density="compact"
			@update:options="loadItems"
		>
			<template v-slot:item.wallet="{ item }">
        <v-btn :to="{name: 'Address', params: {id: item.wallet}}" target="_blank" rounded variant="text" :active="false" class="text-none">{{ shortAddress(item.wallet) }}</v-btn>
        <v-btn icon="mdi-content-copy" variant="text" size="x-small" @click="$clipboard(item.wallet)" />
      </template>
			<template v-slot:item.type="{ item }"><v-chip :color="item.type === 'adds' ? 'success':'error'" class="text-uppercase" size="small">{{ item.type }}</v-chip></template>
			<template v-slot:item.token0_amount="{ item }">{{ toNumber(item.token0_amount) }}</template>
			<template v-slot:item.token1_amount="{ item }">{{ toNumber(item.token1_amount) }}</template>
			<template v-slot:item.token0_total="{ item }">{{ toCurrency(item.token0_total) }}</template>
			<template v-slot:item.token1_total="{ item }">{{ toCurrency(item.token1_total) }}</template>
			<template v-slot:item.total="{ item }">{{ toCurrency(item.total) }}</template>

			<template v-slot:tfoot>
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="4" class="text-right">Total</td>
					<td>{{ toNumber(totalInfo.token0_amount) }}</td>
					<td>${{ formatNumber(totalInfo.token0_total) }}</td>
					<td>{{ toNumber(totalInfo.token1_amount) }}</td>
					<td>${{ formatNumber(totalInfo.token1_total) }}</td>
					<td>${{ formatNumber(totalInfo.total) }}</td>
				</tr>
				</tfoot>
			</template>
		</v-data-table-server>
</template>

<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchDexLiquidityTxs } from "@/api";
import { API_DOMAIN, formatBigNumber, formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import Datepicker from "@/components/Datepicker.vue";

export default {
  name: 'DexPairLiquidityTable',
  components: { Datepicker, VDataTableServer },
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
    per_page: 10,
		page: 1,
		sortBy: [{key: 'date', order: 'desc'}],
		network: 'bsc', // ether | bsc
    headers: [
      { title: 'Date', key: 'date', align: 'center' },
      { title: 'Ago', key: 'ago', align: 'center', sortable: false },
      { title: 'Wallet', key: 'wallet', align: 'center', sortable: false },
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

		pickerPeriod: '',
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

    this.headers.find(i => i.key === 'token0_amount').title = this.pairInfo.token0.symbol.slice(0,5) +' Amount'
    this.headers.find(i => i.key === 'token0_total').title = this.pairInfo.token0.symbol.slice(0,5) +' Amount, $'
    this.headers.find(i => i.key === 'token1_amount').title = this.pairInfo.token1.symbol.slice(0,5) +' Amount'
    this.headers.find(i => i.key === 'token1_total').title = this.pairInfo.token1.symbol.slice(0,5) +' Amount, $'
	},

	watch: {
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
		// ...mapState(useMainStore, {chains: 'chains'}),
		rows() {
			return this.items.map(item => {
				item.ago = moment(item.date).fromNow() //'1y 5m 1d 2h'
				return item
			})
		}
	},
  methods: {
		shortAddress, formatNumber, formatBigNumber, toCurrency, toNumber,

		async loadItems () {
      this.loading = true
      const { data } = await fetchDexLiquidityTxs({
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
				this.items = data.result.items
				this.totalItems = data.result.totalItems
				this.totalInfo = data.result.total
      }
    },

    onPeriodChange($event) {
      this.filter.period = $event;
      this.loadItems()
    }
  },
}
</script>
