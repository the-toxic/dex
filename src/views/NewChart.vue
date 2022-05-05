<template>
  <div>
    <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
      <v-card class="mb-0" elevation="0" tile>
<!--        <v-card-title class="d-flex justify-space-between align-center">-->
<!--          <span>Network: {{ network }}</span>-->
<!--          <span>Price: {{ lastPrice }}</span>-->
<!--          <span>Pair: {{ pairName }}</span>-->
<!--          <span>Exchange: {{ exchange }}</span>-->
<!--          <span>Pair address: {{ pairAddr }}</span>-->
<!--        </v-card-title>-->
        <v-card-text class="d-flex justify-space-between align-center flex-wrap pa-2">
          <div class="d-flex align-center flex-wrap">
            <div class="black mr-2" style="width: 40px; height: 40px"></div>
            <div class="mr-3">
              <h2 class="fs16 font-weight-regular" style="color: #D9DCEE">CryptoTanks</h2>
              <div class="lh-1_2">
                <span class="mr-2">Token: 0x444...f33e</span>
                <span>Pair 4: {{ shortAddress(pairAddr) }}</span>
              </div>
            </div>
            <div class="d-flex justify-center flex-column px-2 mr-2" style="background: #181B25; height: 40px">
              <div class="fs12 lh-1_2">Holders</div><div class="lh-1_2 fs12" style="color: #fff">18,652</div>
            </div>
            <div class="d-flex justify-center flex-column px-2 mr-2" style="background: #181B25; height: 40px">
              <div class="fs12 lh-1_2">Cyrc. Supply</div><div class="lh-1_2 fs12" style="color: #fff">2M</div>
            </div>
            <div class="d-flex justify-center flex-column px-2 mr-2" style="background: #181B25; height: 40px">
              <div class="fs12 lh-1_2">24hr Volume</div><div class="lh-1_2 fs12" style="color: #fff">104k</div>
            </div>
            <div class="d-flex justify-center flex-column px-2 mr-2" style="background: #181B25; height: 40px">
              <div class="fs12 lh-1_2">Liquidity</div><div class="lh-1_2 fs12" style="color: #fff">60k {{ rightToken }}</div>
            </div>
            <div class="d-flex justify-center flex-column px-2 mr-2" style="background: #181B25; height: 40px">
              <div class="fs12 lh-1_2">Market Cap</div><div class="lh-1_2 fs12" style="color: #fff">$8.5M</div>
            </div>
            <div class="d-flex justify-center flex-column px-2 mr-2" style="background: #181B25; height: 40px">
              <div class="fs12 lh-1_2">24hr Swaps</div><div class="lh-1_2 fs12" style="color: #fff">41,650</div>
            </div>
          </div>
          <div>
            <div class="green--text">{{ lastPrice }}</div>
            <div>24hr <span class="red--text">4.41%</span></div>
          </div>
        </v-card-text>
      </v-card>
      <v-progress-linear class="buySellProgress"
        v-model="buySellRate" height="12"
        color="#51A49A" background-color="#DE5F57"
      >
        <template v-slot:default="{ value }">
          <strong>{{ toNumber(buyVolume24) }} {{ rightToken }} / {{ toNumber(sellVolume24) }} {{ rightToken }}</strong>
        </template>
      </v-progress-linear>

      <div id="tv_chart_container"></div>

      <div class="d-flex flex-wrap justify-space-between align-center mt-6">
        <div style="color:#C1C4D6;">Trade History</div>
        <div style="color:#72747F;">
          <span class="mr-3">TXs count</span>
          <span class="" style="color:#305D5E;">Buy: 8,000</span> |
          <span class="" style="color:#77393B;">Sell: 2,000</span> |
          <span class="" style="color:#9EA0AF;">Total: 10,000</span>
        </div>
        <div style="color:#72747F;">
          <span class="mr-3">Volume</span>
          <span class="" style="color:#305D5E;">Buy: 50,000 {{ rightToken }}</span> |
          <span class="" style="color:#77393B;">Sell: 20,000 {{ rightToken }}</span> |
          <span class="" style="color:#9EA0AF;">Total: 70,000 {{ rightToken }}</span>
        </div>
      </div>
      <v-card class="mt-2 mb-8">
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
    buyVolume24: 24123.12,
    sellVolume24: 20111,
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
      if(!newVal) return // on resetState
      // console.log('activeSymbol change', newVal, oldVal)
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
    ...mapGetters('chart', ['activeSymbol', 'lastPrice', 'leftToken', 'rightToken']),
    buySellRate() { return Math.round(this.buyVolume24 / (this.buyVolume24 + this.sellVolume24) * 100) }
  },
  methods: {
    updateTitle() {
      this.title = `${this.pairName} - ${priceFormatter(this.lastPrice)}`
      this.$emit('updateHead') // update title
    }
  }
}
</script>
