<template>
  <div>
    <v-card class="mb-8">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Network: {{ activeNetwork.title }} ({{ activeNetwork.id }})</span>
        <span>Pair: {{ activePair.title }}</span>
        <span>Price: {{ lastPrice }}</span>
      </v-card-title>
      <v-card-text class="fs20">Pair contract: {{ activePair.address }} ({{ activePair.id }})</v-card-text>
    </v-card>
    <v-row>
      <v-col cols="12" md="auto">
        <v-select hide-details label="Network"
          v-model="networkSelect"
          :items="networks" item-value="value" item-text="title"
        />
      </v-col>
      <v-col cols="12" md="">
        <v-select hide-details label="Pair address"
          v-model="pairSelect"
          :items="pairs" item-value="value" item-text="title"
        />
      </v-col>
      <v-col cols="12" md="auto">
        <v-select hide-details label="Timeframe"
          v-model="activeSpan"
          :items="spans" item-value="value" item-text="title"
        />
      </v-col>
      <v-col cols="12" md="">
        <v-autocomplete label="Search pair"
          v-model="searchSelect"
          v-model:search-input="searchInput"
          :loading="searchLoading"
          :items="searchResults"
          cache-items
        />
      </v-col>
    </v-row>

    <Chart :pairId="activePair.id" :span="activeSpan" @priceUpdate="priceUpdate" />

    <TableHistory class="mt-6 mb-8" />
  </div>
</template>

<script>
import Chart from "@/components/Chart.vue";
import TableHistory from "@/components/TableHistory.vue";
import { exponentToNumber } from "@/helpers/common";

export default {
  name: 'Pair',
  head: {
    title() { return {
      inner: this.title
    }},
  },
  components: {TableHistory, Chart},
  data() { return {
    title: 'Loading Pair...',
    networkSelect: null,
    pairSelect: null,
    activeSpan: 1,
    activeNetwork: {
      id: '',
      title: ''
    },
    activePair: {
      id: null,
      title: '',
      address: ''
    },
    lastPrice: 0,

    searchSelect: null,
    searchInput: null,
    searchLoading: false,
    searchResults: [],

    states: [
      'Alabama',
      'Alaska',
      'American Samoa',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'District of Columbia',
      'Federated States of Micronesia',
      'Florida',
      'Georgia',
      'Guam',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Marshall Islands',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Carolina',
      'North Dakota',
      'Northern Mariana Islands',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Palau',
      'Pennsylvania',
      'Puerto Rico',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virgin Island',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming',
    ],
    networks: [{value: 'bsc', title: 'BSC'}, { value: 'ether', title: 'Ethereum'}, {value: 'polygon', title: 'Polygon'}],
    pairs: [
      {value: 29, address: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', title: 'WETH/USDC'}, // USDC-ETH
      {value: 11, address: '0x2b788a7b1a0ee0da8cb1d2769825198d9c95d19d', title: 'TERA/WETH'}, // TERA-WETH
      {value: 2, address: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852', title: 'WETH/USDT'}, // USDT-WETH
      // {value: 2636, address: '0xbf6dcdfe6e138428f5abe709e33e8ac1f7780e48', title: 'WETH/KIBA'}, //KIBA-WETH
      {value: 40, address: '0x9c6c852a56de59a59f7a4527724a2a0a87f7d223', title: 'WETH/FERA'}, // FERA-ETH
      // {value: 54, address: '0x5660c518c5610493086a3ba550f7ad6eb7935d1e', title: 'WETH/RYOSHI'}, // RYOSHI-WETH
      {value: 95, address: '0x3d7e4674b3a78d7aa5892fb43d380292f6910b1d', title: 'WETH/META'}, // WETH-META
      {value: 130, address: '0x7ee3be9a82f051401ca028db1825ac2640884d0a', title: 'DAI/SUSHI'},
      {value: 79, address: '0xceff51756c56ceffca006cd410b03ffc46dd3a58', title: 'WBTC/WETH'},
    ],
    spans: [
      {value: 1, title: '1 min'}, {value: 5, title: '5 min'}, {value: 10, title: '10 min'}, {value: 15, title: '15 min'}, {value: 30, title: '30 min'},
      {value: 60, title: '1 hour'}, {value: 180, title: '3 hour'}, {value: 720, title: '12 hour'}, {value: 1440, title: '1 day'}
    ],
  }},

  async created() {
    const networkId = this.$route.params.network.toString()
    const pairAddress = this.$route.params.pair.toString()

    if(!this.networks.find(i => i.value === networkId))
      return this.$router.push({name: 'Home'})
    if(!this.pairs.find(i => i.address === pairAddress))
      return this.$router.push({name: 'Home'})

    this.activeNetwork.id = networkId
    this.activeNetwork.title = this.networks.find(i => i.value === networkId).title
    const activePair = this.pairs.find(i => i.address === pairAddress)
    this.activePair.id = activePair.value
    this.activePair.title = activePair.title
    this.activePair.address = activePair.address

    this.networkSelect = networkId
    this.pairSelect = activePair.value
    this.title = activePair.title
  },

  // async beforeRouteUpdate(to, from) {
  //   console.log('beforeRouteUpdate', to)
  //   this.title = this.activePair.title
  //   this.$emit('updateHead') // update title
  // },

  watch: {
    '$route.params'(to, from) {
      this.title = this.activePair.title
      this.$emit('updateHead') // update title
    },
    networkSelect(networkId, oldVal) {
      if(oldVal === null) return // on load page
      console.log('network change', oldVal, '->', networkId)
      this.activeNetwork.id = networkId
      this.activeNetwork.title = this.networks.find(i => i.value === networkId).title
      this.$router.push({params: {network: networkId}})
    },
    pairSelect(pairId, oldVal) {
      if(oldVal === null) return // on load page
      console.log('pair change', oldVal, '->', pairId)
      const activePair = this.pairs.find(i => i.value === +pairId)
      this.activePair.id = activePair.value
      this.activePair.title = activePair.title
      this.activePair.address = activePair.address
      this.$router.push({params: {pair: activePair.address}})
    },
    searchInput(val) {
      val && val !== this.select && this.searchQuery(val)
    }
  },
  computed: {
  },
  methods: {
    priceUpdate(val) {
      this.lastPrice = exponentToNumber(val)
    },
    searchQuery(v) {
      this.searchLoading = true
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter(e => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        })
        this.loading = false
      }, 500)
    }
  }
}
</script>