<template>

<!--	<div class="d-flex justify-center align-center flex-wrap px-4 py-3 rounded-t bg-surface2">-->
<!--		<input type="text" ref="datepickerPeriod" placeholder="Period" class="datePickerInput mr-4" />-->
<!--		<v-spacer />-->
<!--		&lt;!&ndash; <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>&ndash;&gt;-->
<!--	</div>-->

<!--	<v-text-field v-model="searchInput" label="Search by Wallets..." prepend-inner-icon="mdi-magnify" hide-details clearable @click:clear="searchInput = ''" density="compact" />-->

<!--	<div class="overflow-x-auto">-->
<!--		<v-data-table-server style="min-width: 1550px"-->
<!--			v-model:items-per-page="per_page"-->
<!--			v-model:sort-by="sortBy"-->
<!--			v-model:page="page"-->
<!--			:headers="headers"-->
<!--			:items-length="totalItems"-->
<!--			:items="items"-->
<!--			:loading="loading"-->
<!--			class="elevation-1 fs14" density="compact"-->
<!--			:items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"-->
<!--			@update:options="loadItems"-->
<!--		> &lt;!&ndash; All Events update: https://vuetifyjs.com/en/api/v-data-table/#events &ndash;&gt;-->
<!--			<template v-slot:column.token0_name="{ column }"><div class="mx-n4 fill-height pt-2" style="background: #262626">{{ column.title }}</div></template>-->
<!--			<template v-slot:column.token1_name="{ column }"><div class="mx-n4 fill-height pt-2" style="background: #2f1d4a">{{ column.title }}</div></template>-->

<!--			<template v-slot:item.wallet="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="text" :active="false" class="text-none">{{ shortAddress(item.wallet) }}</v-btn></template>-->
<!--			<template v-slot:item.removed="{ item }"><v-chip :color="'white'" size="small">{{ item.removed ? 'YES' : 'NO' }}</v-chip></template>-->
<!--			<template v-slot:item.count_adds="{ item }">{{ toNumber(item.count_adds) }}</template>-->
<!--			<template v-slot:item.count_removes="{ item }">{{ toNumber(item.count_removes) }}</template>-->
<!--			<template v-slot:item.count_total="{ item }">{{ toNumber(item.count_total) }}</template>-->

<!--			<template v-slot:item.token0_was="{ item }">${{ formatNumber(item.token0_was) }}</template>-->
<!--			<template v-slot:item.token0_now="{ item }">${{ formatNumber(item.token0_now) }}</template>-->
<!--			<template v-slot:item.token0_profit="{ item }">${{ formatNumber(item.token0_profit) }}</template>-->
<!--			<template v-slot:item.token0_roi="{ item }"><v-chip :color="item.token0_roi > 0 ? 'success': (item.token0_roi < 0 ? 'error' : 'white')" size="small">{{ item.token0_roi > 0 ? '+' : (item.token0_roi < 0 ? '-' : '') }} {{ Math.abs(item.token0_roi) || 0 }}%</v-chip></template>-->

<!--			<template v-slot:item.token1_was="{ item }">${{ formatNumber(item.token1_was) }}</template>-->
<!--			<template v-slot:item.token1_now="{ item }">${{ formatNumber(item.token1_now) }}</template>-->
<!--			<template v-slot:item.token1_profit="{ item }">${{ formatNumber(item.token1_profit) }}</template>-->
<!--			<template v-slot:item.token1_roi="{ item }"><v-chip :color="item.token1_roi > 0 ? 'success': (item.token1_roi < 0 ? 'error' : 'white')" size="small">{{ item.token1_roi > 0 ? '+' : (item.token1_roi < 0 ? '-' : '') }} {{ Math.abs(item.token1_roi) || 0 }}%</v-chip></template>-->

<!--			<template v-slot:tfoot>-->
<!--				<tfoot>-->
<!--				<tr class="text-surface-variant text-center">-->
<!--					<td colspan="2" class="text-right">Total</td>-->
<!--					<td>{{ toNumber(totalInfo.count_adds) }}</td>-->
<!--					<td>{{ toNumber(totalInfo.count_removes) }}</td>-->
<!--					<td>{{ toNumber(totalInfo.count_total) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.token0_was) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.token0_now) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.token0_profit) }}</td>-->
<!--					<td><v-chip :color="totalInfo.token0_roi > 0 ? 'success': (totalInfo.token0_roi < 0 ? 'error' : 'white')" size="small">{{ totalInfo.token0_roi > 0 ? '+' : (totalInfo.token0_roi < 0 ? '-' : '') }} {{ Math.abs(totalInfo.token0_roi) || 0 }}%, avg</v-chip></td>-->
<!--					<td>${{ formatNumber(totalInfo.token1_was) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.token1_now) }}</td>-->
<!--					<td>${{ formatNumber(totalInfo.token1_profit) }}</td>-->
<!--					<td><v-chip :color="totalInfo.token1_roi > 0 ? 'success': (totalInfo.token1_roi < 0 ? 'error' : 'white')" size="small">{{ totalInfo.token1_roi > 0 ? '+' : (totalInfo.token1_roi < 0 ? '-' : '') }} {{ Math.abs(totalInfo.token1_roi) || 0 }}%, avg</v-chip></td>-->
<!--				</tr>-->
<!--				</tfoot>-->
<!--			</template>-->
<!--		</v-data-table-server>-->
<!--	</div>-->
</template>

<script>
// import { easepick, AmpPlugin, RangePlugin, PresetPlugin, TimePlugin } from '@easepick/bundle';
// import { fetchDexPairWallets } from "@/api";
// import { formatBigNumber, formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
// import { useDebounceFn } from "@vueuse/core";

export default {
  name: 'DexPairWalletsTable',
  // data: () => ({
  //   loading: false,
  //   per_page: 20,
	// 	page: 1,
	// 	sortBy: [{key: 'count_total', order: 'desc'}],
  //   headers: [
	// 		[
	// 			{ title: 'Wallet', key: 'wallet', align: 'center', sortable: false, rowspan: 2 },
	// 			{ title: 'Removed', key: 'removed', align: 'center', rowspan: 2, sortable: false },
	// 			{ title: 'Adds Count', key: 'count_adds', align: 'center', rowspan: 2 },
	// 			{ title: 'Removes Count', key: 'count_removes', align: 'center', rowspan: 2 },
	// 			{ title: 'Total Count', key: 'count_total', align: 'center', rowspan: 2 },
	// 			{ title: 'Token0', key: 'token0_name', align: 'center', sortable: false, colspan: 4 },
	// 			{ title: 'Token1', key: 'token1_name', align: 'center', sortable: false, colspan: 4 },
	// 		],
	// 		[
	// 			{ title: 'Was', key: 'token0_was', align: 'center' },
	// 			{ title: 'Now', key: 'token0_now', align: 'center' },
	// 			{ title: 'Profit', key: 'token0_profit', align: 'center' },
	// 			{ title: '%, ROI', key: 'token0_roi', align: 'center' },
	//
	// 			{ title: 'Was', key: 'token1_was', align: 'center' },
	// 			{ title: 'Now', key: 'token1_now', align: 'center' },
	// 			{ title: 'Profit', key: 'token1_profit', align: 'center' },
	// 			{ title: '%, ROI', key: 'token1_roi', align: 'center' },
  //   	]
	// 	],
	// 	searchInput: '',
  //   items: [],
  //   totalItems: 0,
	// 	totalInfo: {},
	//
	// 	pickerPeriod: null,
  // }),
	// async created() {
	// 	this.debouncedFn = useDebounceFn(async () => {
	// 		await this.loadItems()
	// 	}, 500)
	//
	// 	this.headers[0].find(i => i.key === 'token0_name').title = 'BIBA'
	// 	this.headers[0].find(i => i.key === 'token1_name').title = 'BUSD'
	// },
	//
	// watch: {
	// 	searchInput(newVal) {
	// 		this.debouncedFn()
	// 	},
	// },
	// methods: {
	// 	shortAddress, formatNumber, formatBigNumber, toCurrency, toNumber,
	//
  //   async loadItems () {
  //     this.loading = true
  //     const { data } = await fetchDexPairWallets({
	// 			page: this.page,
	// 			per_page: this.per_page,
	// 			sortBy: this.sortBy,
	// 			search: this.searchInput.trim(),
	// 		})
  //     this.loading = false
  //     if(data.success) {
  //       this.items = data.result.items
  //       this.totalItems = data.result.totalItems
  //       this.totalInfo = data.result.total
  //     }
  //   },
  // },
}
</script>
