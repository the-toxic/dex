<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h5 mt-2 mb-2">BIG SWAPS EXPLORER</h1>
    </div>

    <div class="d-flex justify-end align-center flex-wrap px-4 py-3 rounded-t bg-surface2">
      <div style="width: 240px;">
        <v-text-field v-model="minAmount" label="Minimum USD amount" placeholder="More than $10k" rounded variant="outlined"
          persistent-placeholder density="compact" prepend-inner-icon="mdi-currency-usd" hide-details  clearable @click:clear="minAmount = ''" class="mr-4"/>
      </div>
      <div style="width: 240px;">
        <v-text-field v-model="filter.search" label="Search by tokens" rounded variant="outlined"
          density="compact" prepend-inner-icon="mdi-magnify" hide-details  clearable @click:clear="filter.search = ''" class="ml-4"/>
      </div>
    </div>

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
			@update:options="loadItems"
      :items-per-page-options="[20,50,100]"
		>
			<template v-slot:item.pair_name="{ item, internalItem }">
				<v-btn :to="{name: 'Pair', params: {id: item.pair_addr}}" rounded variant="text" density="comfortable" class="text-none">
					<!-- <span class="text-disabled text-right mr-2" style="width: 30px;">#{{ internalItem.index + 1 }}</span>-->
					<TokenIcon :src="item.iconToken0" :alt="item.token0.symbol" class="mr-1" />
					<TokenIcon :src="item.iconToken1" :alt="item.token1.symbol" class="mr-2" />
					{{ item.pair_name }}
					<span class="text-secondary ml-3">{{ item.token0.name }}</span>
				</v-btn>
			</template>
			<template v-slot:item.type="{ item }">
				<v-chip :color="item.type === 'buy' ? 'success': 'error'" class="text-capitalize">{{ item.type}}</v-chip>
			</template>
			<template v-slot:item.quantity="{ item }">{{ formatBigNumber(item.quantity) }}</template>
			<template v-slot:item.total="{ item }">{{ formatBigNumber(item.total) }}</template>
			<template v-slot:item.total_usd="{ item }">${{ formatNumber(item.total_usd) }}</template>
			<template v-slot:item.variation="{ item }">
				<v-chip :color="isNaN(item.variation) ? 'white': (item.variation < 0 ? 'error' : 'success')">
					{{ isNaN(item.variation) ? '' : (item.variation < 0 ? '-' : '+') }} {{ isNaN(item.variation) ? 'Unknown' : Math.abs(item.variation) }}%
				</v-chip>
			</template>
			<template v-slot:item.maker="{ item }"><v-btn :to="{name: 'Address', params: {id: item.maker_addr}}" variant="text" density="compact" rounded class="text-none">{{ shortAddress(item.maker_addr) }}</v-btn></template>
			<template v-slot:item.action="{ item }">
				<v-btn :to="{name: 'Pair', params: {id: item.pair_addr}}"
					 icon="mdi-eye-outline" variant="text" size="small" color="secondary"></v-btn>
			</template>
		</v-data-table-server>
  </v-container>
</template>

<script>
import { fetchBigSwaps } from "@/api";
import { API_DOMAIN, formatNumber, formatBigNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import { mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";
import { useDebounceFn } from "@vueuse/core";
import TokenIcon from "@/components/UI/TokenIcon.vue";

export default {
  name: 'BigSwaps',
	components: { TokenIcon },
  head: () => ({ title: 'Big Swaps' }),
  data() { return {
		API_DOMAIN,
    loading: false,
    per_page: 20,
		page: 1,
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
    filter: {
      search: ''
    },
    items: [],
		minAmount: '',
    totalItems: 999,
  }},
	async created() {
		this.network = this.$route.params.network.toString().toLowerCase()
		if(!['bsc', 'ethereum'].includes(this.network)) this.$router.replace({name: 'Console'})

		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)
	},
	watch: {
		'filter.search'(newVal) {
			this.debouncedFn()
		},
		minAmount(newVal) {
			this.debouncedFn()
		},
	},
	computed: {
		...mapState(useMainStore, {chains: 'chains'}),
		rows() {
			return this.items.map(item => {
				const iconFolder = !this.chains ? null : this.chains[item.chain_id]['icon_folder']
				item.iconToken0 = !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${item.token0.address.toLowerCase().slice(0,4)}/${item.token0.address.toLowerCase()}/default.png`
				item.iconToken1 = !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${item.token1.address.toLowerCase().slice(0,4)}/${item.token1.address.toLowerCase()}/default.png`
				return item
			})
		}
	},
  methods: {
		shortAddress, formatNumber, formatBigNumber, toCurrency, toNumber,

		async loadItems () {
      this.loading = true
      const data = await fetchBigSwaps({
				page: this.page,
				per_page: this.per_page,
				sortBy: this.sortBy,
				search: this.filter.search.trim(),
				minAmount: this.minAmount.trim()
			})
      this.loading = false
      if(data.success) {
        this.items = data.result
      }
    },
  },
}
</script>
