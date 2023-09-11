<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h4 mt-2 mb-2">EXPLORER</h1>
    </div>

    <v-card class="mb-0">
      <v-card-text class="d-flex justify-start align-center flex-wrap pa-4">
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-fire" color="red" start /> Hot Pairs</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-finance" color="success" start /> Gainers</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-emoticon-poop" start color="brown-lighten-1" /> Losers</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-new-box" start /> New Pairs</v-btn>
        <div class="flex-fill"></div>
        <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>
      </v-card-text>
    </v-card>

		<v-text-field v-model="search" label="Search by Tokens..." prepend-inner-icon="mdi-magnify" single-line hide-details/>

		<v-data-table-server
			v-model:items-per-page="itemsPerPage"
			v-model:sort-by="sortBy"
			:headers="headers"
			:items-length="totalItems"
			:items="rows"
			:search="search"
			:loading="loading"
			class="elevation-1"
			id="pair_id"
			@update:options="loadItems"
		>
			<template v-slot:item.pair_name="{ item }">
				<v-btn :to="{name: 'Pair', params: {network: this.network, pairAddr: item.raw.pair_addr}}" rounded variant="text"  class="text-none">
					<span class="text-disabled text-right mr-2" style="width: 30px;">#{{ item.index + 1 }}</span>
					<v-img :src="item.raw.iconToken0" width="24" height="24" :alt="item.raw.token0.symbol" class="va-top rounded-xl">
						<template v-slot:error><div class="bg-grey-darken-3 fill-height text-center fs14 pt-1">?</div></template>
					</v-img>
					<v-img :src="item.raw.iconToken1" width="24" height="24" :alt="item.raw.token1.symbol" class="va-top rounded-xl mx-2">
						<template v-slot:error><div class="bg-grey-darken-3 fill-height text-center fs14 pt-1">?</div></template>
					</v-img>
					{{ item.raw.pair_name }}
					<span class="text-secondary ml-3">{{ item.raw.token0.name }}</span>
				</v-btn>
			</template>
			<template v-slot:item.price="{ item }">${{ priceFormatter(item.raw.last_price) }}</template>
			<template v-slot:item.txs="{ item }">{{ formatNumber(item.raw.txs) }}</template>
			<template v-slot:item.volume="{ item }">{{formatNumber(item.raw.volume_token0) }}</template>
			<template v-slot:item.change_24h="{ item }">
				<v-chip :color="item.raw.change_24h > 0 ? 'success': (item.raw.change_24h < 0 ? 'error' : 'white')">
					{{ item.raw.change_24h > 0 ? '+' : (item.raw.change_24h < 0 ? '-' : '') }} {{ Math.abs(item.raw.change_24h) || 0 }}%
				</v-chip>
			</template>
			<template v-slot:item.liquidity="{ item }">${{ formatNumber(item.raw.liquidity) || 0 }}</template>
			<template v-slot:item.action="{ item }">
				<v-btn :to="{name: 'Pair', params: {network: this.network, pairAddr: item.raw.pair_addr}}"
					 icon="mdi-eye-outline" variant="text" size="small" color="secondary"></v-btn>
			</template>
		</v-data-table-server>
  </v-container>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchPairs } from "@/api";
import { formatNumber, toCurrency, toNumber } from "@/helpers/mixins";
import { priceFormatter } from "@/helpers/common";
import { mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
  name: 'Pairs',
  components: { VDataTableServer },

  data: () => ({
    loading: false,
		network: 'bsc',
    itemsPerPage: 10,
		sortBy: [{key: 'txs', order: 'desc'}],
    headers: [
      { title: 'Token', key: 'pair_name', align: 'start', sortable: false },
      { title: 'Price', key: 'price', align: 'center' },
      { title: 'TXs', key: 'txs', align: 'center' },
      { title: 'Volume', key: 'volume', align: 'center' },
      { title: '% 24h', key: 'change_24h', align: 'center' },
      { title: 'Liquidity', key: 'liquidity', align: 'center' },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    search: '',
    items: [],
    totalItems: 999,
  }),

	async created() {
		this.network = this.$route.params.network.toString().toLowerCase()
		if(!['bsc', 'ethereum'].includes(this.network)) this.$router.replace({name: 'Console'})
	},
	computed: {
		...mapState(useMainStore, {chains: 'chains'}),
		iconFolder() { return this.chains.find(v => v.name.toLowerCase() === this.network)['icon_folder'] },
		rows() {
			const apiDomain = import.meta.env.VITE_APP_API_DOMAIN
			return this.items.map(item => {
				item.iconToken0 = `${apiDomain}${this.iconFolder}${item.token0.address.toLowerCase().slice(0,4)}/${item.token0.address.toLowerCase()}/default.png`
				item.iconToken1 = `${apiDomain}${this.iconFolder}${item.token1.address.toLowerCase().slice(0,4)}/${item.token1.address.toLowerCase()}/default.png`
				return item
			})
		}
	},
  methods: {
    priceFormatter, formatNumber, toCurrency, toNumber,

    async loadItems ({ page, itemsPerPage, sortBy }) {
      this.loading = true
			const { data } = await fetchPairs({ page, itemsPerPage, sortBy, search: this.search.trim() })
			this.loading = false
			if(data.success) {
				this.items = data.result
			}
    },
  },
}
</script>
