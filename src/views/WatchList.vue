<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h4 mt-2 mb-2">WATCHLIST</h1>
    </div>

		<v-tabs v-model="tab" class="mt-6 mb-6 border-b">
			<v-tab value="wallets">Wallets</v-tab>
			<v-tab value="tokens">Tokens</v-tab>
			<v-tab value="nfts">NFTs</v-tab>
		</v-tabs>

		<v-window v-model="tab">
			<v-window-item value="wallets">
				<v-card class="mb-0">
					<v-card-text class="d-flex justify-start align-center flex-wrap pa-4">
						<p class="font-weight-bold mb-2 mb-md-0">Wallet watchlist (1/1000)</p>
						<v-spacer />
						<div class="d-flex flex-wrap align-center">
							<v-btn rounded class="text-none mb-2 mb-md-0" color="primary">Add Wallet</v-btn>
							<v-btn rounded class="text-none mb-2 mb-md-0 ml-3" variant="outlined">Import Database</v-btn>
							<v-btn rounded class="text-none mb-2 mb-md-0 ml-3" variant="outlined">Export</v-btn>
						</div>
					</v-card-text>
				</v-card>

				<v-data-table-server
					v-model:items-per-page="itemsPerPage"
					v-model:sort-by="sortBy"
					:headers="headersWallets"
					:items-length="totalItems"
					:items="itemsWallets"
					:loading="loading"
					class="elevation-1"
					@update:options="loadItemsWallets"
				>
					<template v-slot:item.label="{ item }">
						<v-btn :to="{name: 'Console'}" rounded variant="text"  class="text-none">
							<span class="text-disabled text-right mr-2" style="width: 30px;">#{{ item.index + 1 }}</span>
							<v-icon icon="mdi-ethereum" />
							{{ item.raw.label }}
						</v-btn>
					</template>
					<template v-slot:item.address="{ item }"><a :href="item.raw.address" target="_blank">{{ shortAddress(item.raw.address) }}</a></template>
					<template v-slot:item.description="{ item }">{{ shortString(item.raw.description) }}</template>
					<template v-slot:item.action="{ item }">
						<v-btn :to="{name: 'Console'}" icon="mdi-square-edit-outline" variant="text" size="small" color="secondary"></v-btn>
						<v-btn :to="{name: 'Console'}" icon="mdi-trash-can-outline" variant="text" size="small" color="error"></v-btn>
					</template>
				</v-data-table-server>
			</v-window-item>

			<v-window-item value="tokens">
				<v-data-table-server
					v-model:items-per-page="itemsPerPage"
					v-model:sort-by="sortBy"
					:headers="headersTokens"
					:items-length="totalItems"
					:items="itemsTokens"
					:loading="loading"
					class="elevation-1"
					@update:options="loadItemsTokens"
				>
					<template v-slot:item.name="{ item }">
						<v-btn :to="{name: 'Console'}" rounded variant="text"  class="text-none">
							<v-icon icon="mdi-ethereum" />
							{{ item.raw.name }}
						</v-btn>
					</template>
					<template v-slot:item.price="{ item }">${{ priceFormatter(item.raw.price) }}</template>
					<template v-slot:item.percent_5_holders="{ item }">{{ formatNumber(item.raw.percent_5_holders) }}%</template>
					<template v-slot:item.change_7d="{ item }">
						<v-chip :color="item.raw.change_7d < 0 ? 'error' : 'success'">{{ item.raw.change_7d < 0 ? '-' : '+' }} {{ priceFormatter(Math.abs(item.raw.change_7d)) }}</v-chip>
					</template>
					<template v-slot:item.change_30d="{ item }">
						<v-chip :color="item.raw.change_30d < 0 ? 'error' : 'success'">{{ item.raw.change_30d < 0 ? '-' : '+' }} {{ priceFormatter(Math.abs(item.raw.change_30d)) }}</v-chip>
					</template>
					<template v-slot:item.market_cap="{ item }">{{ formatNumber(item.raw.market_cap) }}</template>
					<template v-slot:item.action="{ item }">
						<v-btn :to="{name: 'Console'}" icon="mdi-trash-can-outline" variant="text" size="small" color="error"></v-btn>
					</template>
				</v-data-table-server>
			</v-window-item>

			<v-window-item value="nfts">
				Soon...
			</v-window-item>
		</v-window>

  </v-container>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchWhitelistTokens, fetchWhitelistWallets } from "@/api";
import { formatNumber, shortAddress, shortString, toCurrency, toNumber } from "@/helpers/mixins";
import { priceFormatter } from "@/helpers/common";

export default {
  name: 'WatchList',
  components: { VDataTableServer },
  data() { return {
    loading: false,
		tab: 'wallets',
    itemsPerPage: 10,
		sortBy: [{key: 'date', order: 'desc'}],
		network: 'bsc', // ether | bsc
    headersWallets: [
      { title: 'Label', key: 'label', align: 'start', sortable: false },
      { title: 'Address', key: 'address', align: 'center', sortable: false },
      { title: 'Description', key: 'description', align: 'center', sortable: false },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    headersTokens: [
      { title: 'Name', key: 'name', align: 'center', sortable: false },
      { title: 'Price', key: 'price', align: 'center' },
      { title: '% Concentration (Top 5 holders)', key: 'percent_5_holders', align: 'center' },
      { title: 'Top holder change (7D)', key: 'change_7d', align: 'center' },
			{ title: 'Top holder change (30D)', key: 'change_30d', align: 'center' },
      { title: 'Total Market Cap', key: 'market_cap', align: 'center' },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    itemsWallets: [],
    itemsTokens: [],
    totalItems: 999,
  }},

  methods: {
		shortString, shortAddress, priceFormatter, formatNumber, toCurrency, toNumber,
    async loadItemsWallets ({ page, itemsPerPage, sortBy }) {
      this.loading = true
      const data = await fetchWhitelistWallets({ page, itemsPerPage, sortBy })
      this.loading = false
      if(data.success) {
        this.itemsWallets = data.result
      }
    },

    async loadItemsTokens ({ page, itemsPerPage, sortBy }) {
      this.loading = true
      const data = await fetchWhitelistTokens({ page, itemsPerPage, sortBy })
      this.loading = false
      if(data.success) {
        this.itemsTokens = data.result
      }
    },
  },
}
</script>
