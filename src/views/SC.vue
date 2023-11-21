<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h4 mt-2 mb-2">SC</h1>
    </div>

		<div class="d-flex justify-center align-center flex-wrap px-4 py-3 rounded-t bg-surface2">
			<input type="text" ref="datepickerBuy" placeholder="Period of Buy tokens" class="datePickerInput mr-4" />
			<input type="text" ref="datepickerSell" placeholder="Period of Sell tokens" class="datePickerInput" />
			<v-spacer />
      <div style="width: 250px">
        <v-text-field v-model="filter.search" label="Search by Wallets" placeholder="" rounded variant="outlined"
          density="compact" prepend-inner-icon="mdi-magnify" hide-details  clearable @click:clear="filter.search = ''" class="ml-4"/>
      </div>
<!--			<v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>-->
		</div>

		<v-data-table-server
			v-model:page="page"
			v-model:items-per-page="per_page"
			v-model:sort-by="sortBy"
			:headers="headers"
			:items-length="totalItems"
			:items="items"
			:search="filter.search"
			:loading="loading"
			class="elevation-1"
			:items-per-page-options="[20,50,100]"
			@update:options="loadItems"
		> <!-- All Events update: https://vuetifyjs.com/en/api/v-data-table/#events -->
			<template v-slot:item.wallet="{ item, internalItem }">
				<v-btn :to="{name: 'Address', params: {id: item.wallet}}" rounded variant="text" :active="false" class="text-none">
					<span class="text-disabled mr-1" style="width: 30px;">#{{ internalItem.index + 1 }}</span>
					{{ shortAddress(item.wallet) }}
				</v-btn>
        <v-btn icon="mdi-content-copy" variant="text" size="x-small" @click="$clipboard(item.wallet)" />
			</template>
			<template v-slot:item.tx_id="{ item }">
				<v-btn rounded variant="text" :href="`https://${item.tx_id}`" target="_blank" class="text-none">{{ shortAddress(item.tx_id) }} <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn>
			</template>
			<template v-slot:item.bought="{ item }">{{ formatBigNumber(item.bought) }}</template>
			<template v-slot:item.sold="{ item }">{{ formatBigNumber(item.sold) }}</template>
			<template v-slot:item.different="{ item }">{{ formatBigNumber(item.different) }}</template>
			<template v-slot:item.cost="{ item }">{{ toCurrency(item.cost) }}</template>
			<template v-slot:item.revenue="{ item }">{{ toCurrency(item.revenue) }}</template>
			<template v-slot:item.profit="{ item }">{{ toCurrency(item.profit) }}</template>
			<template v-slot:item.roi="{ item }">
				<v-chip :color="item.roi > 0 ? 'success': (item.roi < 0 ? 'error' : 'white')">
					{{ item.roi > 0 ? '+' : (item.roi < 0 ? '-' : '') }} {{ Math.abs(item.roi) || 0 }}%
				</v-chip>
			</template>
			<template v-slot:item.action="{ item }">
				<v-btn :to="{name: 'Console'}" icon="mdi-eye-outline" variant="text" size="small" :active="false" color="secondary"></v-btn>
			</template>
			<template v-slot:tfoot>
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="2" class="text-left">Total</td>
					<td>{{ formatBigNumber(totalInfo.bought) }}</td>
					<td>{{ formatBigNumber(totalInfo.sold) }}</td>
					<td>{{ formatBigNumber(totalInfo.different) }}</td>
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
import { easepick, AmpPlugin, RangePlugin, PresetPlugin, TimePlugin } from '@easepick/bundle';
import { fetchSC } from "@/api";
import { formatBigNumber, formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";

export default {
  name: 'SC',
  head: () => ({ title: 'SC' }),
  data: () => ({
    loading: false,
    page: 1,
    per_page: 20,
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
    filter: {
      search: '',
    },
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
		shortAddress, formatNumber, formatBigNumber, toCurrency, toNumber,

    async loadItems () {
      this.loading = true
      const { data } = await fetchSC({
        page: this.page,
        per_page: this.per_page,
        sortBy: this.sortBy,
        search: this.filter.search.trim()
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
