<template>
  <div>
    <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
      <v-card class="mb-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Network: {{ network }}</span>
          <span>Price: {{ lastPrice }}</span>
          <span>Pair: {{ pairName }}</span>
        </v-card-title>
        <v-card-text class="fs20 d-flex justify-space-between align-center">
          <span>Exchange: {{ exchange }}</span>
          <span>Pair address: {{ pairAddr }}</span>
        </v-card-text>
      </v-card>

      <div id="tv_chart_container"></div>

      <v-card class="mt-6 mb-8">
        <TableHistory />
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { initChart } from "@/helpers/chart/chart";
import TableHistory from "@/components/TableHistory";
import { priceFormatter } from "@/helpers/common";

export default {
  name: "NewChart",
  head: {
    title() { return {
      inner: this.title
    }},
  },
  components: {TableHistory},
  data() { return {
    title: 'Loading Pair...',
    pairName: '...',
    network: '...',
    exchange: '...',
    pairAddr: '',
    networks: [{value: 'bsc', title: 'Binance Smart Chain'}, { value: 'ethereum', title: 'Ethereum'}, {value: 'polygon', title: 'Polygon'}],
  } },

  async created() {
    const network = this.$route.params.network.toString().toLowerCase()
    const pairAddress = this.$route.params.pairAddr.toString().toLowerCase()

    if(!this.networks.find(i => i.value === network))
      return this.$router.push({name: 'Home'})
    // if(!this.pairs.find(i => i.address === pairAddress))
    //   return this.$router.push({name: 'Home'})

    this.network = network
    this.pairAddr = pairAddress
  },

  mounted() {
    initChart(this.pairAddr)
    // tvWidget.onChartReady(() => {
    //   const symbol = tvWidget.activeChart().symbolExt()
    //   this.pairName = symbol.symbol
    //   this.network = symbol.type
    //   this.exchange = symbol.exchange
    //   this.exchange = symbol.exchange
    //   this.pairAddr = symbol.description
    // });

  },
  destroyed() {
    window.tvWidget.remove()
    this.$store.commit('chart/resetState')
  },
  // tvWidget.activeChart().symbolExt()
  // Intl.DateTimeFormat().resolvedOptions().timeZone
  // tvWidget.activeChart().setTimezone('Asia/Singapore');
  // tvWidget.activeChart().setSymbol('PanCake v2:TANK/BUSD:0x4e14498c6f679c6421db117bc9e9b08671d42996')
  // tvWidget.activeChart().setResolution('1D');
  // tvWidget.activeChart().executeActionById('symbolSearch'); // показать поиск
  watch: {
    // '$route.params'(to, from) {
    //   this.title = `${this.pairName} - ${this.lastPrice}`
    //   this.$emit('updateHead') // update title
    // },
    activeSymbol(newVal, oldVal) {
      console.log('activeSymbol change')
      this.pairName = newVal.symbol
      this.pairAddr = newVal.pair_addr
      this.exchange = newVal.exchange
      this.network = newVal.type
      this.updateTitle()
      if(oldVal && (newVal.type !== oldVal.type || newVal.pair_addr !== oldVal.pair_addr)) {
        this.$router.push({params: {
          network: this.network.toLowerCase(),
          pairAddr: this.pairAddr
        }})
      }
    },
    lastPrice() {
      this.updateTitle()
    }
  },
  computed: {
    ...mapGetters('chart', ['activeSymbol', 'lastPrice'])
    // pairName() { return '' }
  },
  methods: {
    updateTitle() {
      this.title = `${this.pairName} - ${priceFormatter(this.lastPrice)}`
      this.$emit('updateHead') // update title
    }
  }
}
</script>
