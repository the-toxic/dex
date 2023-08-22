<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h4 mt-2 mb-2">Explorer</h1>
    </div>
    <v-card class="mb-0" :loading="loading">
      <v-card-text class="d-flex justify-start align-center flex-wrap pa-4">
        <v-btn rounded class="text-none mr-2" variant="outlined">Hot pairs</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined">Gainers</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined">Loosers</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined">New Pairs</v-btn>
        <v-btn rounded class="text-none mr-2" variant="outlined">New Pairs</v-btn>
        <div class="flex-fill"></div>
        <v-btn rounded class="text-none" variant="outlined"><v-icon start icon="mdi-filter" /> Filter</v-btn>
      </v-card-text>
    </v-card>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items-length="totalItems"
          :items="items"
          :loading="loading"
          :search="search"
          class="elevation-1"
          item-value="name"
          @update:options="loadItems"
        >
          <template v-slot:item.token="{ item }">
            <v-btn :to="{name: 'Pair', params: {network: item.raw.network, pairAddr: item.raw.pair_addr}}" rounded variant="text">
              <span class="text-disabled">#{{ item.index + 1 }}</span>
              <img :src="item.raw.img_left_token" :alt="item.columns.token" width="24" class="va-top ml-2">
              <img :src="item.raw.img_right_token" alt="BUSD" width="24" class="va-top mx-2">
              {{ item.columns.token }}
            </v-btn>
          </template>
          <template v-slot:item.change_24h="{ item }">
            <v-chip :color="item.columns.change_24h > 0 ? 'success': 'error'">
              {{ item.columns.change_24h > 0 ? '+' : '-' }} {{ Math.abs(item.columns.change_24h) }}%
            </v-chip>
          </template>
          <template v-slot:item.txs="{ item }">{{ formatNumber(item.columns.txs) }}</template>
          <template v-slot:item.volume="{ item }">${{formatNumber(item.columns.volume) }}</template>
          <template v-slot:item.price="{ item }">{{ toCurrency(item.columns.price) }}</template>
          <template v-slot:item.liquidity="{ item }">${{ formatNumber(item.columns.liquidity) }}</template>
          <template v-slot:item.action="{ item }">
            <v-btn :to="{name: 'Pair', params: {network: item.raw.network, pairAddr: item.raw.pair_addr}}"
               icon="mdi-eye" variant="text" size="small" color="secondary"></v-btn>
          </template>
        </v-data-table-server>
  </v-container>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchPairs } from "@/api";
import { formatNumber, toCurrency, toNumber } from "@/helpers/mixins";

export default {
  name: 'Pairs',
  components: { VDataTableServer },
  data: () => ({
    loading: false,
    itemsPerPage: 5,
    headers: [
      { title: 'Token', key: 'token', align: 'start', sortable: false, },
      { title: 'Price', key: 'price', align: 'center' },
      { title: 'TXs', key: 'txs', align: 'center' },
      { title: 'Volume', key: 'volume', align: 'center' },
      { title: '% 24h', key: 'change_24h', align: 'center' },
      { title: 'Swaps', key: 'swaps', align: 'center' },
      { title: 'Liquidity', key: 'liquidity', align: 'center' },
      { title: 'Action', key: 'action', align: 'center' },
    ],
    search: '',
    items: [],
    totalItems: 0,
  }),
  methods: {
    formatNumber,
    toCurrency,
    toNumber,
    async loadItems ({ page, itemsPerPage, sortBy }) {
      this.loading = true
      const { data } = await fetchPairs({ page, itemsPerPage, sortBy })
      this.loading = false
      if(data.success) {
        this.items = data.result.items
        this.totalItems = data.result.total
      }
    },
  },
}
</script>
