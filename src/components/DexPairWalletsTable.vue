<template>

	<div class="d-flex justify-center align-center flex-wrap pa-4" style="background: #141d26">
		<input type="text" ref="datepickerPeriod" placeholder="Period" class="datePickerInput mr-4" />
		<v-spacer />
		<!-- <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>-->
	</div>

	<v-text-field v-model="searchInput" label="Search by Wallets..." prepend-inner-icon="mdi-magnify" hide-details clearable @click:clear="searchInput = ''" density="compact" />

	<div class="overflow-x-auto">
		<v-data-table-server style="min-width: 1550px"
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
			<template v-slot:column.token0_name="{ column }"><div class="mx-n4 fill-height pt-2" style="background: #262626">{{ column.title }}</div></template>
			<template v-slot:column.token1_name="{ column }"><div class="mx-n4 fill-height pt-2" style="background: #2f1d4a">{{ column.title }}</div></template>

			<template v-slot:item.wallet="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="text" :active="false" class="text-none">{{ shortAddress(item.raw.wallet) }}</v-btn></template>
			<template v-slot:item.removed="{ item }"><v-chip :color="'white'" size="small">{{ item.raw.removed ? 'YES' : 'NO' }}</v-chip></template>
			<template v-slot:item.count_adds="{ item }">{{ toNumber(item.raw.count_adds) }}</template>
			<template v-slot:item.count_removes="{ item }">{{ toNumber(item.raw.count_removes) }}</template>
			<template v-slot:item.count_total="{ item }">{{ toNumber(item.raw.count_total) }}</template>

			<template v-slot:item.token0_was="{ item }">${{ formatNumber(item.raw.token0_was) }}</template>
			<template v-slot:item.token0_now="{ item }">${{ formatNumber(item.raw.token0_now) }}</template>
			<template v-slot:item.token0_profit="{ item }">${{ formatNumber(item.raw.token0_profit) }}</template>
			<template v-slot:item.token0_roi="{ item }"><v-chip :color="item.raw.token0_roi > 0 ? 'success': (item.raw.token0_roi < 0 ? 'error' : 'white')" size="small">{{ item.raw.token0_roi > 0 ? '+' : (item.raw.token0_roi < 0 ? '-' : '') }} {{ Math.abs(item.raw.token0_roi) || 0 }}%</v-chip></template>

			<template v-slot:item.token1_was="{ item }">${{ formatNumber(item.raw.token1_was) }}</template>
			<template v-slot:item.token1_now="{ item }">${{ formatNumber(item.raw.token1_now) }}</template>
			<template v-slot:item.token1_profit="{ item }">${{ formatNumber(item.raw.token1_profit) }}</template>
			<template v-slot:item.token1_roi="{ item }"><v-chip :color="item.raw.token1_roi > 0 ? 'success': (item.raw.token1_roi < 0 ? 'error' : 'white')" size="small">{{ item.raw.token1_roi > 0 ? '+' : (item.raw.token1_roi < 0 ? '-' : '') }} {{ Math.abs(item.raw.token1_roi) || 0 }}%</v-chip></template>

			<template v-slot:tfoot>
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="2" class="text-right">Total</td>
					<td>{{ toNumber(totalInfo.count_adds) }}</td>
					<td>{{ toNumber(totalInfo.count_removes) }}</td>
					<td>{{ toNumber(totalInfo.count_total) }}</td>
					<td>${{ formatNumber(totalInfo.token0_was) }}</td>
					<td>${{ formatNumber(totalInfo.token0_now) }}</td>
					<td>${{ formatNumber(totalInfo.token0_profit) }}</td>
					<td><v-chip :color="totalInfo.token0_roi > 0 ? 'success': (totalInfo.token0_roi < 0 ? 'error' : 'white')" size="small">{{ totalInfo.token0_roi > 0 ? '+' : (totalInfo.token0_roi < 0 ? '-' : '') }} {{ Math.abs(totalInfo.token0_roi) || 0 }}%, avg</v-chip></td>
					<td>${{ formatNumber(totalInfo.token1_was) }}</td>
					<td>${{ formatNumber(totalInfo.token1_now) }}</td>
					<td>${{ formatNumber(totalInfo.token1_profit) }}</td>
					<td><v-chip :color="totalInfo.token1_roi > 0 ? 'success': (totalInfo.token1_roi < 0 ? 'error' : 'white')" size="small">{{ totalInfo.token1_roi > 0 ? '+' : (totalInfo.token1_roi < 0 ? '-' : '') }} {{ Math.abs(totalInfo.token1_roi) || 0 }}%, avg</v-chip></td>
				</tr>
				</tfoot>
			</template>
		</v-data-table-server>
	</div>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { easepick, AmpPlugin, RangePlugin, PresetPlugin, TimePlugin } from '@easepick/bundle';
import { fetchDexPairWallets } from "@/api";
import { formatBigNumber, formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";

export default {
  name: 'DexPairWalletsTable',
  components: { VDataTableServer },
  data: () => ({
    loading: false,
    itemsPerPage: 20,
		page: 1,
		sortBy: [{key: 'count_total', order: 'desc'}],
    headers: [
			[
				{ title: 'Wallet', key: 'wallet', align: 'center', sortable: false, rowspan: 2 },
				{ title: 'Removed', key: 'removed', align: 'center', rowspan: 2, sortable: false },
				{ title: 'Adds Count', key: 'count_adds', align: 'center', rowspan: 2 },
				{ title: 'Removes Count', key: 'count_removes', align: 'center', rowspan: 2 },
				{ title: 'Total Count', key: 'count_total', align: 'center', rowspan: 2 },
				{ title: 'Token0', key: 'token0_name', align: 'center', sortable: false, colspan: 4 },
				{ title: 'Token1', key: 'token1_name', align: 'center', sortable: false, colspan: 4 },
			],
			[
				{ title: 'Was', key: 'token0_was', align: 'center' },
				{ title: 'Now', key: 'token0_now', align: 'center' },
				{ title: 'Profit', key: 'token0_profit', align: 'center' },
				{ title: '%, ROI', key: 'token0_roi', align: 'center' },

				{ title: 'Was', key: 'token1_was', align: 'center' },
				{ title: 'Now', key: 'token1_now', align: 'center' },
				{ title: 'Profit', key: 'token1_profit', align: 'center' },
				{ title: '%, ROI', key: 'token1_roi', align: 'center' },
    	]
		],
		token0_name: 'asd',
		searchInput: '',
    items: [],
    totalItems: 0,
		totalInfo: {},

		pickerPeriod: null,
  }),
	async created() {
		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)

		this.headers[0].find(i => i.key === 'token0_name').title = 'TANK'
		this.headers[0].find(i => i.key === 'token1_name').title = 'BUSD'
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
		// this.pickerPeriod.getDate()
		// this.pickerPeriod.clear()
	},
	watch: {
		searchInput(newVal) {
			this.debouncedFn()
		},
	},
	methods: {
		shortAddress, formatNumber, formatBigNumber, toCurrency, toNumber,

    async loadItems () {
      this.loading = true
      const { data } = await fetchDexPairWallets({
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
