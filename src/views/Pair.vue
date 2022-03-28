<template>
  <v-card class="mb-8">
    <v-card-header>
      <v-card-header-text>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Network: {{ networkName }} ({{ networkId }})</span>
          <span>Pair: {{ pairName }}</span>
          <span>Price: {{ lastPrice }}</span>
        </v-card-title>
        <v-card-subtitle>Pair contract: ${{ pairSelect }} ({{ pairId }})</v-card-subtitle>
      </v-card-header-text>
    </v-card-header>
  </v-card>
  <v-row>
    <v-col cols="12" md="auto">
      <v-select hide-details label="Select Network" variant="outlined"
        v-model="networkSelect"
        :items="Object.values(networks)"
      />
    </v-col>
    <v-col cols="12" md="">
      <v-select hide-details label="Pairs" variant="outlined"
        v-model="pairSelect"
        :items="pairs.map(i => i.text)"
      /> <!-- item-text="text" item-value="value" -->
    </v-col>
    <v-col cols="12" md="auto">
      <v-select hide-details label="Timeframe" variant="outlined"
        v-model="span"
        :items="spans"
      />
    </v-col>
    <v-col cols="12" md="">
      <v-text-field label="Search pair" disabled variant="outlined" />
    </v-col>
  </v-row>

  <Chart :pairId="pairId" :span="span" @priceUpdate="priceUpdate" />

  <TableHistory class="mt-6 mb-8" />

</template>

<script>
import Chart from "../components/Chart.vue";
import TableHistory from "../components/TableHistory.vue";
import { closeWs, startCandles } from "../api";
import { exponentToNumber } from "../helpers/common";

export default {
  name: 'Pair',
  components: {TableHistory, Chart},
  data() { return {
    networkId: null,
    networkSelect: null,
    pairId: null,
    pairSelect: null,
    pairName: '',
    span: 1,
    lastPrice: 0,
    networks: {bsc: 'BSC', ether: 'Ethereum', polygon: 'Polygon'},
    // networks: [{text: 'BNB Chain', value: 'bsc'}, {text: 'Ethereum', value: 'ether'}, {text: 'Polygon', value: 'polygon'}]
    pairs: [
      {value: 29, text: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', name: 'WETH/USDC'}, // USDC-ETH
      // {value: 11, text: '0x2b788a7b1a0ee0da8cb1d2769825198d9c95d19d', name: 'TERA-WETH'}, // TERA-WETH
      {value: 2, text: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852', name: 'WETH/USDT'}, // USDT-WETH
      // {value: 2636, text: '0xbf6dcdfe6e138428f5abe709e33e8ac1f7780e48', name: 'WETH/KIBA'}, //KIBA-WETH
      {value: 40, text: '0x9c6c852a56de59a59f7a4527724a2a0a87f7d223', name: 'WETH/FERA'}, // FERA-ETH
      {value: 54, text: '0x5660c518c5610493086a3ba550f7ad6eb7935d1e', name: 'WETH/RYOSHI'}, // RYOSHI-WETH
      {value: 95, text: '0x3d7e4674b3a78d7aa5892fb43d380292f6910b1d', name: 'WETH/META'}, // WETH-META
      {value: 130, text: '0x7ee3be9a82f051401ca028db1825ac2640884d0a', name: 'DAI/SUSHI'},
    ],
    spans: [1, 5, 10, 15, 30, 60, 180, 720, 1440],
  }},

  async created() {
    const networkId = this.$route.params.network.toString()
    const pair = this.$route.params.pair.toString()

    if(!Object.keys(this.networks).includes(networkId))
      return this.$router.push({name: 'Home'})
    if(!this.pairs.find(i => i.text === pair))
      return this.$router.push({name: 'Home'})

    this.networkId = networkId
    this.networkSelect = this.networks[networkId]
    this.pairId = this.pairs.find(i => i.text === pair).value
    this.pairSelect = pair

    // startCandles(this.pairId, this.span, 1648025979)
  },

  async beforeRouteUpdate(to, from) {
    console.log('call beforeRouteUpdate')
    // console.log('beforeRouteUpdate', to)
    this.networkId = to.params.network
    // networkSelect ???
    this.pairSelect = to.params.pair
    this.pairId =  this.pairs.find(i => i.text === to.params.pair).value

  },

  watch: {
    networkSelect(val) {
      this.$router.push({params: {network: this.networkNameToId(val)}})
    },
    pairSelect(val, valOld) {
      console.log('pairSelect', val, valOld)
      // closeWs()
      this.pairName = this.pairs.find(i => i.text === val).name
      this.$router.push({params: {pair: val}})
    }
  },
  computed: {
    networkName() {
      return this.networks[this.networkId]
    }
  },
  methods: {
    networkNameToId(name) {
      const idx = Object.values(this.networks).findIndex(i => i === name)
      return Object.keys(this.networks)[idx]
    },
    priceUpdate(val) {
      this.lastPrice = exponentToNumber(val)
    }
  }
}
</script>