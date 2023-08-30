<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h4 mt-2 mb-2">BIG SWAPS EXPLORER</h1>
    </div>

    <v-card class="mb-0">
      <v-card-text class="d-flex justify-start align-center flex-wrap pa-4">
        <v-spacer />
				<div class="d-flex align-center" style="min-width: 300px">
					<v-text-field v-model="minAmount" label="Minimum USD amount" placeholder="More than $10k" rounded variant="outlined"
						persistent-placeholder density="compact" prepend-inner-icon="mdi-currency-usd" hide-details class="mr-4"/>
        	<v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>
				</div>
      </v-card-text>
    </v-card>

		<v-text-field v-model="search" label="Search by Tokens" append-inner-icon="mdi-magnify" single-line hide-details/>

		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			v-model:sort-by="sortBy"
			:headers="headers"
			:items-length="totalItems"
			:items="items"
			:search="search"
			:loading="loading"
			class="elevation-1"
			id="pair_id"
			@update:options="loadItems"
		>
			<template v-slot:item.pair_name="{ item }">
				<v-btn :to="{name: 'Pair', params: {network: this.network, pairAddr: item.raw.pair_addr}}" rounded variant="text"  class="text-none">
					<span class="text-disabled text-right mr-2" style="width: 30px;">#{{ item.index + 1 }}</span>
					<img v-if="item.raw.token0?.icon" :src="item.raw.token0.icon" :alt="item.raw.token0.symbol" width="24" class="va-top rounded-xl">
					<img v-if="item.raw.token1?.icon" :src="item.raw.token1.icon" :alt="item.raw.token1.symbol" width="24" class="va-top rounded-xl mx-2">
					{{ item.raw.pair_name }}
					<span class="text-secondary ml-3">{{ item.raw.token0.name }}</span>
				</v-btn>
			</template>
			<template v-slot:item.type="{ item }">
				<v-chip :color="item.raw.type === 'buy' ? 'success': 'error'" class="text-capitalize">{{ item.raw.type}}</v-chip>
			</template>
			<template v-slot:item.quantity="{ item }">{{ formatNumber(item.raw.quantity) }}</template>
			<template v-slot:item.total="{ item }">{{ formatNumber(item.raw.total) }}</template>
			<template v-slot:item.total_usd="{ item }">${{ priceFormatter(item.raw.total_usd) }}</template>
			<template v-slot:item.variation="{ item }">
				<v-chip :color="isNaN(item.raw.variation) ? 'white': (item.raw.variation < 0 ? 'error' : 'success')">
					{{ isNaN(item.raw.variation) ? '' : (item.raw.variation < 0 ? '-' : '+') }} {{ isNaN(item.raw.variation) ? 'Unknown' : Math.abs(item.raw.variation) }}%
				</v-chip>
			</template>
			<template v-slot:item.maker="{ item }"><a :href="item.raw.maker_addr" target="_blank">{{ shortAddress(item.raw.maker_addr) }}</a></template>
			<template v-slot:item.action="{ item }">
				<v-btn :to="{name: 'Pair', params: {network: this.network, pairAddr: item.raw.pair_addr}}"
					 icon="mdi-eye-outline" variant="text" size="small" color="secondary"></v-btn>
			</template>
		</v-data-table-server>
  </v-container>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchBigSwaps } from "@/api";
import { formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { priceFormatter } from "@/helpers/common";

export default {
  name: 'BigSwaps',
  components: { VDataTableServer },
  data() { return {
    loading: false,
    itemsPerPage: 10,
		sortBy: [{key: 'date', order: 'desc'}],
		network: 'bsc', // ether | bsc
    headers: [
      { title: 'Token', key: 'pair_name', align: 'start', sortable: false },
      { title: 'Execution Time', key: 'date', align: 'center' },
      { title: 'Type', key: 'type', align: 'center' },
      { title: 'Quantity', key: 'quantity', align: 'center' },
			{ title: 'Total BNB', key: 'total', align: 'center' },
      { title: 'Total USD', key: 'total_usd', align: 'center' },
      { title: 'Variation', key: 'variation', align: 'center' },
      { title: 'Maker', key: 'maker', align: 'center', sortable: false },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    search: '',
    items: [],
		minAmount: '',
    totalItems: 999,
  }},
	async created() {
		this.network = this.$route.params.network.toString().toLowerCase()
		if(!['bsc', 'ether'].includes(this.network)) this.$router.replace({name: 'Console'})
	},
  methods: {
		shortAddress,
    priceFormatter, formatNumber, toCurrency, toNumber,
    async loadItems ({ page, itemsPerPage, sortBy }) {
      this.loading = true
      const data = await fetchBigSwaps({ page, itemsPerPage, sortBy, search: this.search.trim() })
      this.loading = false
      if(data.success) {
        this.items = data.result
      }
    },
  },
}
</script>
