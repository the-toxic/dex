<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h5 mt-2 mb-2">EXPLORER</h1>
    </div>

    <v-card class="mb-0">
      <v-card-text class="d-flex justify-space-between align-center flex-wrap pa-4">
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-fire" color="red" start /> Hot Pairs</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-finance" color="success" start /> Gainers</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-emoticon-poop" start color="brown-lighten-1" /> Losers</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined"><v-icon icon="mdi-new-box" start /> New Pairs</v-btn>
        <div class="flex-fill"></div>
<!--        <v-btn @click="filterOpened = !filterOpened" rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>-->
<!--				<v-divider class="my-3" />-->
<!--				<div v-if="filterOpened">-->
					<v-select label="Chain" v-model="network" class="flex-grow-0" style="width: 150px"
						:items="[{value: 'bsc', title: 'BSC'}, {value: 'ethereum', title: 'Ethereum'}]"
						variant="outlined" rounded hide-details density="compact"></v-select>
<!--				</div>-->
      </v-card-text>
    </v-card>

<!--		<v-text-field v-model.lazy="searchInput" label="Search by Tokens..." prepend-inner-icon="mdi-magnify" hide-details clearable @click:clear="searchInput = ''" />-->

		<v-data-table-server
			v-model:items-per-page="per_page"
			v-model:sort-by="sortBy"
			v-model:page="page"
			:headers="headers"
			:items-length="totalItems"
			:items="rows"
			:loading="loading"
			class="elevation-1"
			density="comfortable"
			:items-per-page-options="[20,50,100]"
		>
<!--			@update:options="loadItems"-->
      <template v-slot:bottom></template> <!-- hide footer -->
			<template v-slot:item.pair_name="{ item, internalItem }">
				<v-btn :to="{name: 'Pair', params: {id: item.pair_addr}}" rounded variant="text" density="comfortable" class="text-none">
					<span class="text-disabled text-right mr-2" style="width: 30px;">#{{ internalItem.index + 1 }}</span>
					<TokenIcon :src="item.iconToken0" :alt="item.token0.symbol" width="24" class="mr-1" />
					<TokenIcon :src="item.iconToken1" :alt="item.token1.symbol" width="24" class="mr-2" />
					{{ item.token0.symbol }}/{{ item.token1.symbol }}
					<span class="text-secondary ml-3">{{ item.token0.name }}</span>
				</v-btn>
			</template>
			<template v-slot:item.price="{ item }">${{ formatNumber(item.last_price) }}</template>
			<template v-slot:item.txs="{ item }">{{ formatBigNumber(item.txs) }}</template>
			<template v-slot:item.volume="{ item }">{{formatBigNumber(item.need_invert ? item.volume_token1 : item.volume_token0) }}</template>
			<template v-slot:item.change_24h="{ item }">
				<v-chip :color="item.change_24h > 0 ? 'success': (item.change_24h < 0 ? 'error' : 'white')">
					{{ item.change_24h > 0 ? '+' : (item.change_24h < 0 ? '-' : '') }} {{ Math.abs(item.change_24h) || 0 }}%
				</v-chip>
			</template>
			<template v-slot:item.liquidity="{ item }">${{ formatBigNumber(item.liquidity) || 0 }}</template>
			<!-- <template v-slot:item.action="{ item }">
				<v-btn :to="{name: 'Pair', params: {id: item.pair_addr}}"
					 icon="mdi-eye-outline" variant="text" size="small" color="secondary"></v-btn>
			</template>-->
		</v-data-table-server>
  </v-container>
</template>

<script>
import { fetchPairs } from "@/api";
import { API_DOMAIN, formatBigNumber, formatNumber, needInvert, toCurrency, toNumber } from "@/helpers/mixins";
import { mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";
import TokenIcon from "@/components/UI/TokenIcon.vue";

export default {
  name: 'Pairs',
	components: { TokenIcon },
  head: () => ({ title: 'Explorer' }),
  data: () => ({
		API_DOMAIN,
    loading: false,
		filterOpened: true,
		network: '',
    per_page: 20,
		sortBy: [{key: 'txs', order: 'desc'}],
		page: 1,
    headers: [
      { title: 'Token', key: 'pair_name', align: 'start', sortable: false },
      { title: 'Price', key: 'price', align: 'center' },
      { title: 'TXs', key: 'txs', align: 'center' },
      { title: 'Volume', key: 'volume', align: 'center' },
      { title: '% 24h', key: 'change_24h', align: 'center' },
      { title: 'Liquidity', key: 'liquidity', align: 'center' },
      // { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    searchInput: '',
    items: [],
    totalItems: 999,
  }),

	async created() {
		this.network = this.$route.params.network.toString().toLowerCase()
		if(!['all', 'bsc', 'ethereum'].includes(this.network)) this.$router.replace({name: 'Console'})

		// this.debouncedFn = useDebounceFn(async () => {
		// 	await this.loadItems()
		// }, 500)

		await this.loadItems()
	},
	watch: {
		// searchInput(newVal) {
		// 	console.log('watch')
		// 	this.debouncedFn()
		// },
		network(newVal, oldVal) {
			if(!oldVal) return
			console.log('chain', newVal)
			this.$router.replace({params: {network: newVal}})
			this.loadItems()
		}
	},
	computed: {
		...mapState(useMainStore, {chains: 'chains'}),
		rows() {
			return this.items.map(item => {
				if(needInvert(item.token0.symbol, item.token1.symbol)) {
					const oldToken0 = item.token0
					item.token0 = item.token1
					item.token1 = oldToken0
					item.last_price = 1 / item.last_price
					item.need_invert = true
				}
				const iconFolder = !this.chains ? null : this.chains[item.chain_id]['icon_folder']
				item.iconToken0 = !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${item.token0.address.toLowerCase().slice(0,4)}/${item.token0.address.toLowerCase()}/default.png`
				item.iconToken1 = !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${item.token1.address.toLowerCase().slice(0,4)}/${item.token1.address.toLowerCase()}/default.png`

				return item
			})
		}
	},
  methods: {
    formatNumber, formatBigNumber, toCurrency, toNumber,

    async loadItems () {
      this.loading = true
			const { data } = await fetchPairs({
				page: this.page,
				per_page: this.per_page,
				sortBy: this.sortBy,
				search: this.searchInput.trim(),
				chain_id: this.network === 'all' ? 0 : (this.network === 'bsc' ? 2 : 1)
			})
			this.loading = false
			if(data.success) {
				this.items = data.result
			}
    },
  },
}
</script>
