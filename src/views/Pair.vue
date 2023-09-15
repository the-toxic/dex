<template>
  <div>
    <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
      <v-card class="mb-0" :loading="pairInfoLoading">
        <v-card-text class="d-flex justify-space-between align-center flex-wrap pa-2">
          <div class="d-flex align-center flex-wrap">
            <v-btn icon="mdi-arrow-left" :to="{name: 'Console'}" :active="false" size="x-large" density="compact" class="mr-2" />
            <div class="mr-2" :class="{'bg-blue-grey-darken-3': !pairInfo || !iconToken0}" style="width: 40px; height: 40px;border-radius: 50%;overflow: hidden;">
							<v-img :src="iconToken0" width="40" height="40" alt="Logo">
								<template v-slot:error><div class="bg-grey-darken-3 fill-height text-center pt-3 fs28">?</div></template>
								<template v-slot:placeholder><div class="d-flex align-center justify-center fill-height">
									<v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular></div>
								</template>
							</v-img>
            </div>
            <div class="mr-3">
              <h2 class="fs16 font-weight-regular" style="color: #D9DCEE">{{ tokenName }}</h2>
              <div v-if="pairInfo" class="lh-1_2">
                <span class="mr-2">Token: {{shortAddress(pairInfo.token0.address) }} <CopyLabel icon :text="pairInfo.token0.address" icon-color="#72747F" /></span>
                <span>Pair: {{ shortAddress(pairAddr) }} <CopyLabel icon :text="pairAddr" icon-color="#72747F" /></span>
              </div>
            </div>
            <div class="d-flex justify-center flex-column rounded px-2 mr-2" style="background: #141825; height: 40px">
              <div class="fs12 lh-1_2">Holders</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(holders) }}</div>
            </div>
            <div class="d-flex justify-center flex-column rounded px-2 mr-2" style="background: #141825; height: 40px">
              <div class="fs12 lh-1_2">Total Supply</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(totalSupply) }}</div>
            </div>
            <div class="d-flex justify-center flex-column rounded px-2 mr-2" style="background: #141825; height: 40px">
              <div class="fs12 lh-1_2">24hr Volume</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(volume24h) }}</div>
            </div>
            <div class="d-flex justify-center flex-column rounded px-2 mr-2" style="background: #141825; height: 40px">
              <div class="fs12 lh-1_2">Liquidity</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(liquidity) }} {{ rightToken }}</div>
            </div>
            <div class="d-flex justify-center flex-column rounded px-2 mr-2" style="background: #141825; height: 40px">
              <div class="fs12 lh-1_2">Market Cap</div><div class="lh-1_2 fs12" style="color: #fff">${{ shortNumber(marketCap) }}</div>
            </div>
            <div class="d-flex justify-center flex-column rounded px-2 mr-2" style="background: #141825; height: 40px">
              <div class="fs12 lh-1_2">24hr Swaps</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(txCount24) }}</div>
            </div>
          </div>
          <div>
            <div class="green--text">{{ priceFormatter(lastPrice) }} {{ rightToken }}</div>
            <div>24hr <span :class="{'text-red': priceChange < 0, 'text-green': priceChange >= 0}">{{ toNumber(priceChange) }}%</span></div>
          </div>
        </v-card-text>
      </v-card>

      <v-progress-linear class="buySellProgress"
        v-model="buySellRate" height="12"
        color="#51A49A" bg-color="#DE5F57" bg-opacity="1"
      >
        <template v-slot:default="{ value }">
          <strong>{{ shortNumber(buyVolume24) }} {{ rightToken }} / {{ shortNumber(sellVolume24) }} {{ rightToken }}</strong>
        </template>
      </v-progress-linear>

      <div id="tv_chart_container"></div>

      <div class="d-flex flex-wrap justify-space-between align-center mt-6">
        <div class="text-h5 mx-auto" style="color:#C1C4D6;">Last Transactions</div>
				<!--        <div style="color:#72747F;">
          <span class="mr-3">TXs count</span>
          <span class="" style="color:#305D5E;">Buy: {{ toNumber(buyTxCount24) }}</span> |
          <span class="" style="color:#77393B;">Sell: {{ toNumber(sellTxCount24) }}</span> |
          <span class="" style="color:#9EA0AF;">Total: {{ toNumber(buyTxCount24 + sellTxCount24) }}</span>
        </div>
        <div style="color:#72747F;">
          <span class="mr-3">Volume</span>
          <span class="" style="color:#305D5E;">Buy: {{ shortNumber(buyVolume24) }} {{ rightToken }}</span> |
          <span class="" style="color:#77393B;">Sell: {{ shortNumber(sellVolume24) }} {{ rightToken }}</span> |
          <span class="" style="color:#9EA0AF;">Total: {{ shortNumber(buyVolume24 + sellVolume24) }} {{ rightToken }}</span>
        </div>-->
      </div>
      <v-card class="mt-2 mb-8 rounded-xl">
        <TableHistory />
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { initChart } from "@/helpers/chart/chart";
import { API_DOMAIN, PROJECT_NAME, shortAddress, toNumber } from "@/helpers/mixins";
import TableHistory from "@/components/TableHistory.vue";
import { priceFormatter, shortNumber } from "@/helpers/common";
import { mapActions, mapState } from "pinia";
import { useChartStore } from "@/store/chartStore";

export default {
  name: "Pair",
  components: { TableHistory },
  head: {
    title() { return { inner: this.title }},
    meta() { return [{ name: 'description', content: this.description, id: 'desc' }]},
  },
  // components: {TableHistory},
  data() { return {
		API_DOMAIN,
    pairInfoLoading: false,
    title: 'Console',
    description: import.meta.env.VITE_APP_PROJECT_NAME,
    pairName: '...',
    network: '...',
    exchange: '...',
    pairAddr: '',
    networks: [{value: 'bsc', title: 'Binance Smart Chain'}, { value: 'ethereum', title: 'Ethereum'}, {value: 'polygon', title: 'Polygon'}],
    loadingOldTxs: true
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
    await this.loadExchanges()
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
    this.resetState()
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
    async activeSymbol(newVal, oldVal) {
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
        }}).then()
      }
      this.pairInfoLoading = true
      await this.getPairInfo(newVal.pair_id)
      this.pairInfoLoading = false
    },
    lastPrice() {
      this.updateTitle()
    }
  },
  computed: {
    PROJECT_NAME() { return PROJECT_NAME },
    ...mapState(useChartStore, ['activeSymbol', 'pairInfo', 'lastPrice', 'leftToken', 'rightToken', "lastTXs"]),
		iconToken0() {
			return !this.pairInfo ? '' : `${API_DOMAIN}/images/tokens/binance-smart-chain/${this.pairInfo.token0.address.slice(0,4)}/${this.pairInfo.token0.address}/default.png`
		},
    buySellRate() { return !this.pairInfo ? 50 : Math.round(this.buyVolume24 / (this.buyVolume24 + this.sellVolume24) * 100) },
    tokenName() { return this.pairInfo ?  this.pairInfo.token0.name : 'Loading...' },
    buyVolume24() { return this.pairInfo ? Math.round(this.pairInfo.pool.buy_volume_24h) : 0 },
    sellVolume24() { return this.pairInfo ? Math.round(this.pairInfo.pool.sell_volume_24h) : 0 },
    // buyTxCount24() { return this.pairInfo ? this.pairInfo.pool.buy_tx_count_24h : 0 },
    // sellTxCount24() { return this.pairInfo ? this.pairInfo.pool.sell_tx_count_24h : 0 },
    holders() { return this.pairInfo ? this.pairInfo.token0.holders : 0 },
    totalSupply() { return this.pairInfo ? this.pairInfo.token0.total_supply : 0 },
    volume24h() { return this.pairInfo ? this.pairInfo.pool.volume_24h : 0 },
    liquidity() { return this.pairInfo ? this.pairInfo.pool.total_liquidity : 0 },
    txCount24() { return this.pairInfo ? this.pairInfo.pool.tx_count_24h : 0 },
    marketCap() { return this.pairInfo ? this.pairInfo.token0.total_supply * this.lastPrice : 0 },
    priceChange() { return this.pairInfo ? this.pairInfo.pool.price_change_24h : 0 },
  },
  methods: {
    shortAddress, toNumber, // from mixins
    ...mapActions(useChartStore, {getPairInfo: 'getPairInfo', resetState: 'resetState', loadExchanges: 'loadExchanges'}),
    updateTitle() {
      this.title = `${this.pairName} - ${priceFormatter(this.lastPrice)}`
      this.description = `Analyse ${this.pairName} of ${this.PROJECT_NAME} | ${this.pairAddr}`
      this.$emit('updateHead') // update title
    },
    shortNumber(num) { return shortNumber(num) },
    priceFormatter(num) { return priceFormatter(num) }
  }
}
</script>
