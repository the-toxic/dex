<template>

		<div class="d-flex justify-space-between align-center flex-wrap px-4 py-2" style="background: #141d26">
			<input type="text" ref="datepickerPeriod" placeholder="Period" class="datePickerInput mr-4" />
			<div>
				Type:
				<v-btn-toggle v-model="filter.type"  density="comfortable" variant="outlined" class="mr-5">
					<v-btn value="all" class="text-none">All</v-btn>
					<v-btn value="adds" color="success" class="text-none">Adds</v-btn>
					<v-btn value="removes" color="error" class="text-none">Removes</v-btn>
				</v-btn-toggle>
			</div>
			<v-switch label="Show Creator TXs" v-model="filter.isCreator" hide-details color="primary" class="flex-grow-0" />
			<!-- <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>-->
		</div>

		<v-text-field v-model="searchInput" label="Search by Wallet..." prepend-inner-icon="mdi-magnify" hide-details clearable @click:clear="searchInput = ''" density="compact" />

		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			v-model:sort-by="sortBy"
			v-model:page="page"
			:headers="headers"
			:items-length="totalItems"
			:items="rows"
			:loading="loading"
			class="elevation-1 fs14" density="compact"
			@update:options="loadItems"
		>
			<template v-slot:item.wallet="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="text" :active="false" class="text-none">{{ shortAddress(item.raw.wallet) }}</v-btn></template>
			<template v-slot:item.type="{ item }"><v-chip :color="item.raw.type === 'adds' ? 'success':'error'" class="text-uppercase" size="small">{{ item.raw.type }}</v-chip></template>
			<template v-slot:item.token0_amount="{ item }">{{ toNumber(item.raw.token0_amount) }}</template>
			<template v-slot:item.token1_amount="{ item }">{{ toNumber(item.raw.token1_amount) }}</template>
			<template v-slot:item.token0_total="{ item }">{{ toCurrency(item.raw.token0_total) }}</template>
			<template v-slot:item.token1_total="{ item }">{{ toCurrency(item.raw.token1_total) }}</template>
			<template v-slot:item.total="{ item }">{{ toCurrency(item.raw.total) }}</template>

			<template v-slot:tfoot>
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="4" class="text-right">Total</td>
					<td>{{ toNumber(totalInfo.token0_amount) }}</td>
					<td>${{ priceFormatter(totalInfo.token0_total) }}</td>
					<td>{{ toNumber(totalInfo.token1_amount) }}</td>
					<td>${{ priceFormatter(totalInfo.token1_total) }}</td>
					<td>${{ priceFormatter(totalInfo.total) }}</td>
				</tr>
				</tfoot>
			</template>
		</v-data-table-server>
</template>

<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchDexPairTxs } from "@/api";
import { API_DOMAIN, formatNumber, priceFormatter, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import { AmpPlugin, easepick, PresetPlugin, RangePlugin, TimePlugin } from "@easepick/bundle";

export default {
  name: 'DexPairTxsTable',
  components: { VDataTableServer },
  data() { return {
		API_DOMAIN,
    loading: false,
    itemsPerPage: 10,
		page: 1,
		sortBy: [{key: 'date', order: 'desc'}],
		network: 'bsc', // ether | bsc
    headers: [
      { title: 'Date', key: 'date', align: 'center' },
      { title: 'Ago', key: 'ago', align: 'center', sortable: false },
      { title: 'Wallet', key: 'wallet', align: 'center', sortable: false },
      { title: 'Type', key: 'type', align: 'center', sortable: false },
      { title: 'TANK Amount', key: 'token0_amount', align: 'center' },
      { title: 'TANK Amount, $', key: 'token0_total', align: 'center' },
      { title: 'BUSD Amount', key: 'token1_amount', align: 'center' },
      { title: 'BUSD Amount, $', key: 'token1_total', align: 'center' },
			{ title: 'Total Amount, $', key: 'total', align: 'center' },
    ],
    searchInput: '',
    items: [],
    totalItems: 999,
		totalInfo: {},

		pickerPeriod: '',
		filter: {
			type: 'all',
			isCreator: 0
		}
  }},
	async created() {
		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)
	},
	mounted() {
		const _this = this
		this.pickerPeriod = new easepick.create({
			// https://easepick.com/packages/core.html
			element: _this.$refs['datepickerPeriod'],
			autoApply: false,
			zIndex: 10,
			format: 'YYYY-MM-DD HH:mm',
			plugins: [ AmpPlugin, RangePlugin, PresetPlugin, TimePlugin ],
			css: [ 'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css' ],
			setup(picker) {
				picker.on('select', (e) => {
					const { end, start } = e.detail;
					console.log('Buy', start.toISOString(), end.toISOString())
				});
			},
		});
	},
	watch: {
		searchInput(newVal) {
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
		shortAddress, priceFormatter, formatNumber, toCurrency, toNumber,

		async loadItems () {
      this.loading = true
      const { data } = await fetchDexPairTxs({
				page: this.page,
				itemsPerPage: this.itemsPerPage,
				sortBy: this.sortBy,
				search: this.searchInput.trim(),
			})
      this.loading = false
      if(data.success) {
				this.items = data.result.items
				this.totalItems = data.result.totalItems
				this.totalInfo = data.result.total
      }
    },
  },
}
</script>
