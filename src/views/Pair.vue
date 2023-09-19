<template>
  <div>
    <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">

			<v-card class="mb-3" color="transparent" elevation="0" :loading="pairInfoLoading">
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
						<h2 class="fs24 font-weight-regular mr-3" style="color: #D9DCEE">{{ tokenName }}</h2>
						<v-btn size="small" icon="mdi-star-outline" class="mr-3"></v-btn>
						<v-btn size="small" icon="mdi-bell" class="mr-3"></v-btn>
						<v-btn size="small" icon="mdi-information-outline" class="mr-3"></v-btn>
						<div class="fs18 mr-3">{{ priceFormatter(lastPrice) }} {{ rightToken }}</div>
						<div class="fs16 text-disabled mr-3">{{ toCurrency(lastPrice) }}</div>
          </div>
					<!-- <div v-if="pairInfo" class="lh-1_2">
						<span class="mr-2">Token: {{shortAddress(pairInfo.token0.address) }} <CopyLabel icon :text="pairInfo.token0.address" icon-color="#72747F" /></span>
						<span>Pair: {{ shortAddress(pairAddr) }} <CopyLabel icon :text="pairAddr" icon-color="#72747F" /></span>
					</div>-->

          <div> <!-- right side -->
						<v-btn-toggle v-model="tabContent"  density="comfortable" variant="outlined" class="mr-5">
							<v-btn value="dex" class="text-none" >DEX</v-btn>
							<v-btn value="analyze" class="text-none" >Analyze</v-btn>
							<v-btn value="pair" class="text-none" >Pair</v-btn>
						</v-btn-toggle>
						<v-select v-model="pairSelect" :items="[pairName]"  variant="outlined" class="d-inline-block va-middle" hide-details density="compact" />
          </div>
        </v-card-text>
      </v-card>

			<!-- <v-progress-linear class="buySellProgress" v-model="buySellRate" height="12" color="#51A49A" bg-color="#DE5F57" bg-opacity="1">
        <template v-slot:default="{ value }">
          <strong>{{ shortNumber(buyVolume24) }} {{ rightToken }} / {{ shortNumber(sellVolume24) }} {{ rightToken }}</strong>
        </template>
      </v-progress-linear>-->
			<template v-if="tabContent === 'dex'">
				<div class="d-flex">
					<div class="mr-5" style="width: 400px">
						<v-card>
							<v-card-text>
								<div class="d-flex mb-3" style="gap: 10px">
									<div class="flex-fill pa-2 text-center border rounded-lg">
										5M <div :class="{'text-red': priceChange < 0, 'text-green': priceChange >= 0}">{{ toNumber(priceChange) }}%</div>
									</div>
									<div class="flex-fill pa-2 text-center border rounded-lg">
										1H <div :class="{'text-red': priceChange < 0, 'text-green': priceChange >= 0}">{{ toNumber(priceChange) }}%</div>
									</div>
									<div class="flex-fill pa-2 text-center border rounded-lg">
										6H <div :class="{'text-red': priceChange < 0, 'text-green': priceChange >= 0}">{{ toNumber(priceChange) }}%</div>
									</div>
									<div class="flex-fill pa-2 text-center border rounded-lg">
										24H <div :class="{'text-red': priceChange < 0, 'text-green': priceChange >= 0}">{{ toNumber(priceChange) }}%</div>
									</div>
								</div>

								<v-tabs v-model="tabPeriod" fixed-tabs>
									<v-tab value="5m" variant="flat">5M</v-tab>
									<v-tab value="1h" variant="flat">1H</v-tab>
									<v-tab value="6h" variant="flat">6H</v-tab>
									<v-tab value="24h" variant="flat">24H</v-tab>
								</v-tabs>
								<v-window v-model="tabPeriod">
									<v-window-item v-for="period in ['5m', '1h', '6h', '24h']" :value="period">
										<div class="pa-4 rounded border bg-blue-grey-darken-4 d-flex">
											<div>
												<p class="text-disabled">TXs</p><p>53</p>
												<p class="text-disabled mt-4">VOLUME</p><p>$666</p>
												<p class="text-disabled mt-4">MAKERS</p><p>3</p>
											</div>
											<v-divider vertical class="mx-4" />
											<div class="fill-width">
												<div class="d-flex justify-space-between">
													<div class=""><p class="text-disabled">BUYS</p><p>26</p></div>
													<div class="text-right"><p class="text-disabled">SELLS</p><p>23</p></div>
												</div>
												<v-progress-linear rounded height="5" model-value="54" color="#51A49A" bg-color="#DE5F57" bg-opacity="1" />

												<div class="d-flex justify-space-between mt-2">
													<div class=""><p class="text-disabled">BUY VOL</p><p>$333</p></div>
													<div class="text-right"><p class="text-disabled">SELL VOL</p><p>$345</p></div>
												</div>
												<v-progress-linear rounded height="5" model-value="44" color="#51A49A" bg-color="#DE5F57" bg-opacity="1" />

												<div class="d-flex justify-space-between mt-2">
													<div class=""><p class="text-disabled">BUYERS</p><p>2</p></div>
													<div class="text-right"><p class="text-disabled">SELLERS</p><p>1</p></div>
												</div>
												<v-progress-linear rounded height="5" model-value="66" color="#51A49A" bg-color="#DE5F57" bg-opacity="1" />
											</div>
										</div>

									</v-window-item>
								</v-window>

					<!--  <div class="fs12 lh-1_2">Holders</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(holders) }}</div>
								<div class="fs12 lh-1_2">Total Supply</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(totalSupply) }}</div>
								<div class="fs12 lh-1_2">24hr Volume</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(toNumber(volume24h)) }}</div>
								<div class="fs12 lh-1_2">Liquidity</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(toNumber(liquidity)) }} {{ rightToken }}</div>
								<div class="fs12 lh-1_2">Market Cap</div><div class="lh-1_2 fs12" style="color: #fff">${{ shortNumber(toNumber(marketCap)) }}</div>
								<div class="fs12 lh-1_2">24hr Swaps</div><div class="lh-1_2 fs12" style="color: #fff">{{ shortNumber(txCount24) }}</div>-->
							</v-card-text>
						</v-card>

						<Converter v-if="pairInfo" :token="pairInfo.token0.symbol" class="mt-5"/>
						<v-skeleton-loader v-else class="mt-5" style="height: 180px" />
					</div>
					<div class="fill-width" style="height: 534px">
						<ChartTV :pair-addr="pairAddr" />
					</div>
				</div>

				<div class="d-flex flex-wrap justify-space-between align-center mt-6">
					<div class="text-h5" style="color:#C1C4D6;">On-chain Activity</div>
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
			</template>

			<template v-if="tabContent === 'analyze'"><h1>Analyze</h1></template>
			<template v-if="tabContent === 'pair'"><h1>Pair</h1></template>

    </v-container>
  </div>
</template>

<script>
import { API_DOMAIN, PROJECT_NAME, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import TableHistory from "@/components/TableHistory.vue";
import { priceFormatter, shortNumber } from "@/helpers/common";
import { mapActions, mapState } from "pinia";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { useChartStore } from "@/store/chartStore";
import ChartTV from "@/components/ChartTV.vue";
import Converter from "@/components/Converter.vue";

export default {
  name: "Pair",
  components: { Converter, ChartTV, TableHistory, VSkeletonLoader },
  head: {
    title() { return { inner: this.title }},
    meta() { return [{ name: 'description', content: this.description, id: 'desc' }]},
  },
  // components: {TableHistory},
  data() { return {
		tabContent: 'dex',
		tabPeriod: '5m',
		pairSelect: null,
		API_DOMAIN,
    pairInfoLoading: false,
    title: 'Console',
    description: import.meta.env.VITE_APP_PROJECT_NAME,
    pairName: '...',
    network: '...',
    exchange: '...',
    pairAddr: '',
    loadingOldTxs: true
  } },

  async created() {
		this.pairAddr = this.$route.params.pairAddr.toString().toLowerCase()

    if(!this.pairAddr.startsWith('0x'))
      return this.$router.replace({name: 'Console'})

    // await this.loadExchanges()
  },

  watch: {
    async activeSymbol(newVal, oldVal) {
      if(!newVal) return // on resetState
      // console.log('activeSymbol change', newVal, oldVal)
      this.pairName = newVal.symbol
      this.pairSelect = newVal.symbol
      this.pairAddr = newVal.pair_addr
      this.exchange = newVal.exchange
      this.network = newVal.type
      this.updateTitle()
      if(oldVal && (newVal.type !== oldVal.type || newVal.pair_addr !== oldVal.pair_addr)) {
        this.$router.push({params: { pairAddr: this.pairAddr }}).then()
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
		toCurrency,
    shortAddress, toNumber, shortNumber, priceFormatter,  // from mixins
    ...mapActions(useChartStore, {getPairInfo: 'getPairInfo', resetState: 'resetState', loadExchanges: 'loadExchanges'}),

    updateTitle() {
      this.title = `${this.pairName} - ${priceFormatter(this.lastPrice)}`
      this.description = `Analyse ${this.pairName} of ${this.PROJECT_NAME} | ${this.pairAddr}`
      this.$emit('updateHead') // update title
    },
  }
}
</script>
