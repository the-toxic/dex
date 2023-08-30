<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h4 mt-2 mb-2">SC</h1>
    </div>

    <v-card class="mb-0">
      <v-card-text class="d-flex justify-center align-center flex-wrap pa-4">
        <v-spacer />

        <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>
      </v-card-text>
    </v-card>

		<v-text-field v-model="search" label="Search by Wallets" append-inner-icon="mdi-magnify" single-line hide-details/>

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
				<v-btn :to="{name: 'Console'}" rounded class="text-none">
					<span class="text-disabled mr-1" style="width: 30px;">#{{ item.index + 1 }}</span>
					{{ shortAddress(item.raw.wallet) }}
				</v-btn>
			</template>
			<template v-slot:item.tx_id="{ item }">
				<v-btn rounded :href="`https://${item.raw.tx_id}`" target="_blank" class="text-none">{{ shortAddress(item.raw.tx_id) }} <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn>
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
				<v-btn :to="{name: 'Console'}" icon="mdi-eye-outline" variant="text" size="small" color="secondary"></v-btn>
			</template>
			<template v-slot:tfoot="qq">
<!--				<v-divider />-->
				<tfoot>
				<tr class="text-surface-variant text-center">
					<td colspan="2" class="text-left">Total</td>
					<td>{{ formatNumber(totalInfo.bought) }}</td>
					<td>{{ formatNumber(totalInfo.sold) }}</td>
					<td>{{ formatNumber(totalInfo.different) }}</td>
					<td>{{ toCurrency(totalInfo.cost) }}</td>
					<td>{{ toCurrency(totalInfo.revenue) }}</td>
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
		totalInfo: {}
  }),
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
