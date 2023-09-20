<template>

	<div class="d-flex justify-center align-center flex-wrap pa-4" style="background: #141d26">
		<input type="text" ref="datepickerBuy" placeholder="Period of Buy tokens" class="datePickerInput mr-4" />
		<input type="text" ref="datepickerSell" placeholder="Period of Sell tokens" class="datePickerInput" />
		<v-spacer />
		<!-- <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>-->
	</div>

	<v-text-field v-model="searchInput" label="Search by Wallets..." prepend-inner-icon="mdi-magnify" hide-details clearable @click:clear="searchInput = ''" />

	<div class="overflow-x-auto">
		<v-data-table-server style="min-width: 1550px"
			v-model:items-per-page="itemsPerPage"
			v-model:sort-by="sortBy"
			v-model:page="page"
			:headers="headers"
			:items-length="totalItems"
			:items="items"
			:loading="loading"
			class="elevation-1"
			:items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"
			@update:options="loadItems"
		> <!-- All Events update: https://vuetifyjs.com/en/api/v-data-table/#events -->
			<template v-slot:column.wallet="{ column }"><div class="mx-n4 fill-height pt-11 border">{{ column.title }}</div></template>
			<template v-slot:column.profit="{ column }"><div class="mx-n4 fill-height pt-11 border">{{ column.title }}</div></template>
			<template v-slot:column.roi="{ column }"><div class="mx-n4 fill-height pt-11 border">{{ column.title }}</div></template>
			<template v-slot:column.buys="{ column }"><div class="bg-green-darken-4 mx-n4 fill-height pt-4">{{ column.title }}</div></template>
			<template v-slot:column.sells="{ column }"><div class="bg-red-darken-4 mx-n4 fill-height pt-4">{{ column.title }}</div></template>

			<template v-slot:item.wallet="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="text" :active="false" class="text-none">{{ shortAddress(item.raw.wallet) }}</v-btn></template>
			<template v-slot:item.profit="{ item }">{{ toCurrency(item.raw.profit) }}</template>
			<template v-slot:item.roi="{ item }"><v-chip :color="item.raw.roi > 0 ? 'success': (item.raw.roi < 0 ? 'error' : 'white')">{{ item.raw.roi > 0 ? '+' : (item.raw.roi < 0 ? '-' : '') }} {{ Math.abs(item.raw.roi) || 0 }}%</v-chip></template>
			<template v-slot:item.buy_tx_id="{ item }"><v-btn rounded variant="text" :href="`https://bscscan.com/address/${item.raw.buy_tx_id}`" target="_blank" class="text-none">{{ shortAddress(item.raw.buy_tx_id) }} <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn></template>
			<template v-slot:item.sell_tx_id="{ item }"><v-btn rounded variant="text" :href="`https://bscscan.com/address/${item.raw.sell_tx_id}`" target="_blank" class="text-none">{{ shortAddress(item.raw.sell_tx_id) }} <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn></template>
			<template v-slot:item.buy_amount="{ item }">{{ formatNumber(item.raw.buy_amount) }}</template>
			<template v-slot:item.sell_amount="{ item }">{{ formatNumber(item.raw.sell_amount) }}</template>
			<template v-slot:item.buy_price="{ item }">${{ priceFormatter(item.raw.buy_price) }}</template>
			<template v-slot:item.sell_price="{ item }">${{ priceFormatter(item.raw.sell_price) }}</template>
			<template v-slot:item.buy_total="{ item }">${{ priceFormatter(item.raw.buy_total) }}</template>
			<template v-slot:item.sell_total="{ item }">${{ priceFormatter(item.raw.sell_total) }}</template>

			<template v-slot:tfoot>
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="1" class="text-right">Total</td>
					<td>{{ toCurrency(totalInfo.profit) }}</td>
					<td>
						<v-chip :color="totalInfo.roi > 0 ? 'success': (totalInfo.roi < 0 ? 'error' : 'white')">
							{{ totalInfo.roi > 0 ? '+' : (totalInfo.roi < 0 ? '-' : '') }} {{ Math.abs(totalInfo.roi) || 0 }}%, avg
						</v-chip>
					</td>
					<td></td><td></td>
					<td>{{ formatNumber(totalInfo.buy_amount) }}</td>
					<td>${{ priceFormatter(totalInfo.buy_price) }}</td>
					<td>${{ priceFormatter(totalInfo.buy_total) }}</td>
					<td></td><td></td>
					<td>{{ formatNumber(totalInfo.sell_amount) }}</td>
					<td>${{ priceFormatter(totalInfo.sell_price) }}</td>
					<td>${{ priceFormatter(totalInfo.sell_total) }}</td>
				</tr>
				</tfoot>
			</template>
		</v-data-table-server>
	</div>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { easepick, AmpPlugin, RangePlugin, PresetPlugin, TimePlugin } from '@easepick/bundle';
import { fetchDexAnalyzeTxs } from "@/api";
import { formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { priceFormatter } from "@/helpers/common";
import { useDebounceFn } from "@vueuse/core";

export default {
  name: 'DexAnalyzeTxsTable',
  components: { VDataTableServer },
  data: () => ({
    loading: false,
    itemsPerPage: 20,
		page: 1,
		sortBy: [{key: 'date', order: 'desc'}],
    headers: [
			[
				{ title: 'Wallet', key: 'wallet', align: 'center', sortable: false, rowspan: 2 },
				{ title: 'Profit', key: 'profit', align: 'center', rowspan: 2 },
				{ title: '% ROI', key: 'roi', align: 'center', rowspan: 2 },
				{ title: 'Buys', key: 'buys', align: 'center', sortable: false, colspan: 5, color: 'bg-green' },
				{ title: 'Sells', key: 'sells', align: 'center', sortable: false, colspan: 5 },
			],
			[
				{ title: 'Date', key: 'buy_date', align: 'center' },
				{ title: 'TX ID', key: 'buy_tx_id', align: 'center', sortable: false },
				{ title: 'Amount', key: 'buy_amount', align: 'center' },
				{ title: 'Price', key: 'buy_price', align: 'center' },
				{ title: 'Total', key: 'buy_total', align: 'center' },

				{ title: 'Date', key: 'sell_date', align: 'center' },
				{ title: 'TX ID', key: 'sell_tx_id', align: 'center', sortable: false },
				{ title: 'Amount', key: 'sell_amount', align: 'center' },
				{ title: 'Price', key: 'sell_price', align: 'center' },
				{ title: 'Total', key: 'sell_total', align: 'center' },
    	]
		],
		searchInput: '',
    items: [],
    totalItems: 0,
		totalInfo: {},

		pickerBuy: null,
		pickerSell: null,
  }),
	async created() {
		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)
	},
	mounted() {
		const _this = this
		this.pickerBuy = new easepick.create({
			// https://easepick.com/packages/core.html
			element: _this.$refs['datepickerBuy'],
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
		// this.pickerBuy.getDate()
		// this.pickerBuy.clear()

		this.pickerSell = new easepick.create({
			element: _this.$refs['datepickerSell'],
			autoApply: false,
			zIndex: 10,
			format: 'YYYY-MM-DD HH:mm',
			plugins: [ AmpPlugin, RangePlugin, PresetPlugin, TimePlugin ],
			css: [ 'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css' ],
			setup(picker) {
				picker.on('select', (e) => {
					const { end, start } = e.detail;
					console.log('Sell', start.toISOString(), end.toISOString())
				});
			},
		});
		// picker.getDate();
		// picker.setDate('2023-01-01 - 2023-08-08');
	},
	watch: {
		searchInput(newVal) {
			this.debouncedFn()
		},
	},
	methods: {
		shortAddress, priceFormatter, formatNumber, toCurrency, toNumber,

    async loadItems () {
      this.loading = true
      const { data } = await fetchDexAnalyzeTxs({
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
