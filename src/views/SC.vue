<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h4 mt-2 mb-2">SC</h1>
    </div>

		<div class="d-flex justify-center align-center flex-wrap pa-4" style="background: #141d26">
			<input type="text" ref="datepickerBuy" placeholder="Period of Buy tokens" class="datePickerInput mr-4" />
			<input type="text" ref="datepickerSell" placeholder="Period of Sell tokens" class="datePickerInput" />
			<v-spacer />
<!--			<v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>-->
		</div>

		<v-text-field v-model="search" label="Search by Wallets..." prepend-inner-icon="mdi-magnify" single-line hide-details/>

		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			v-model:sort-by="sortBy"
			:headers="headers"
			:items-length="totalItems"
			:items="items"
			:search="search"
			:loading="loading"
			class="elevation-1"
			:items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"
			@update:options="loadItems"
		> <!-- All Events update: https://vuetifyjs.com/en/api/v-data-table/#events -->
			<template v-slot:item.wallet="{ item }">
				<v-btn :to="{name: 'Console'}" rounded variant="text" :active="false" class="text-none">
					<span class="text-disabled mr-1" style="width: 30px;">#{{ item.index + 1 }}</span>
					{{ shortAddress(item.raw.wallet) }}
				</v-btn>
			</template>
			<template v-slot:item.tx_id="{ item }">
				<v-btn rounded variant="text" :href="`https://${item.raw.tx_id}`" target="_blank" class="text-none">{{ shortAddress(item.raw.tx_id) }} <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn>
			</template>
			<template v-slot:item.bought="{ item }">{{ formatNumber(item.raw.bought) }}</template>
			<template v-slot:item.sold="{ item }">{{ formatNumber(item.raw.sold) }}</template>
			<template v-slot:item.different="{ item }">{{ formatNumber(item.raw.different) }}</template>
			<template v-slot:item.cost="{ item }">{{ toCurrency(item.raw.cost) }}</template>
			<template v-slot:item.revenue="{ item }">{{ toCurrency(item.raw.revenue) }}</template>
			<template v-slot:item.profit="{ item }">{{ toCurrency(item.raw.profit) }}</template>
			<template v-slot:item.roi="{ item }">
				<v-chip :color="item.raw.roi > 0 ? 'success': (item.raw.roi < 0 ? 'error' : 'white')">
					{{ item.raw.roi > 0 ? '+' : (item.raw.roi < 0 ? '-' : '') }} {{ Math.abs(item.raw.roi) || 0 }}%
				</v-chip>
			</template>
			<template v-slot:item.action="{ item }">
				<v-btn :to="{name: 'Console'}" icon="mdi-eye-outline" variant="text" size="small" :active="false" color="secondary"></v-btn>
			</template>
			<template v-slot:tfoot>
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="2" class="text-left">Total</td>
					<td>{{ formatNumber(totalInfo.bought) }}</td>
					<td>{{ formatNumber(totalInfo.sold) }}</td>
					<td>{{ formatNumber(totalInfo.different) }}</td>
					<td>{{ toCurrency(totalInfo.cost) }}, avg</td>
					<td>{{ toCurrency(totalInfo.revenue) }}, avg</td>
					<td>{{ toCurrency(totalInfo.profit) }}</td>
					<td>
						<v-chip :color="totalInfo.roi > 0 ? 'success': (totalInfo.roi < 0 ? 'error' : 'white')">
							{{ totalInfo.roi > 0 ? '+' : (totalInfo.roi < 0 ? '-' : '') }} {{ Math.abs(totalInfo.roi) || 0 }}%, avg
						</v-chip>
					</td>
					<td></td>
				</tr>
				</tfoot>
			</template>

		</v-data-table-server>
  </v-container>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { easepick, AmpPlugin, RangePlugin, PresetPlugin, TimePlugin } from '@easepick/bundle';
import { fetchSC } from "@/api";
import { formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { priceFormatter } from "@/helpers/common";

export default {
  name: 'SC',
  components: { VDataTableServer },
  data: () => ({
    loading: false,
    itemsPerPage: 20,
		sortBy: [{key: 'profit', order: 'desc'}],
    headers: [
      { title: 'Wallet', key: 'wallet', align: 'start', sortable: false },
      { title: 'TX ID', key: 'tx_id', align: 'center', sortable: false },
      { title: 'Bought, Tokens', key: 'bought', align: 'center' },
      { title: 'Sold, Tokens', key: 'sold', align: 'center' },
      { title: 'Different', key: 'different', align: 'center' },
      { title: 'Cost', key: 'cost', align: 'center' },
      { title: 'Revenue', key: 'revenue', align: 'center' },
      { title: 'Profit', key: 'profit', align: 'center' },
      { title: '% ROI', key: 'roi', align: 'center' },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    search: '',
    items: [],
    totalItems: 0,
		totalInfo: {},

		pickerBuy: null
  }),
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

		const pickerSell = new easepick.create({
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
	methods: {
		shortAddress, priceFormatter, formatNumber, toCurrency, toNumber,

    async loadItems ({ page, itemsPerPage, sortBy }) {
      this.loading = true
      const { data } = await fetchSC({ page, itemsPerPage, sortBy, search: this.search.trim() })
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
