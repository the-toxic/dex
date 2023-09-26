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
						<h2 class="fs24 font-weight-regular mr-3" style="color: #D9DCEE">{{ tokenTitle }}</h2>
						<v-btn size="small" icon="mdi-star-outline" class="mr-3"></v-btn>
						<v-btn size="small" icon="mdi-bell" class="mr-3"></v-btn>
						<v-btn size="small" icon="mdi-information-outline" class="mr-3"></v-btn>
						<div class="fs18 mr-3">{{ formatNumber(lastPrice) }} {{ rightToken }}</div>
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
						<v-select v-model="pairSelect" :items="pairSelectItems" :loading="pairInfoLoading"  variant="outlined" class="d-inline-block va-middle" hide-details density="compact" />
          </div>
        </v-card-text>
      </v-card>

			<!-- <v-progress-linear class="buySellProgress" v-model="buySellRate" height="12" color="#51A49A" bg-color="#DE5F57" bg-opacity="1">
        <template v-slot:default="{ value }">
          <strong>{{ shortNumber(buyVolume24) }} {{ rightToken }} / {{ shortNumber(sellVolume24) }} {{ rightToken }}</strong>
        </template>
      </v-progress-linear>-->
			<div v-show="tabContent === 'dex'">
				<div class="d-flex">
					<div class="mr-5" style="width: 400px">
						<v-card>
							<v-card-text>
								<div class="d-flex mb-3" style="gap: 10px">
									<div class="flex-fill pa-2 text-center border rounded-lg">
										1H <div :class="{'text-red': priceChange24H < 0, 'text-green': priceChange24H >= 0}">{{ toNumber(priceChange24H) }}%</div>
									</div>
									<div class="flex-fill pa-2 text-center border rounded-lg">
										6H <div :class="{'text-red': priceChange24H < 0, 'text-green': priceChange24H >= 0}">{{ toNumber(priceChange24H) }}%</div>
									</div>
									<div class="flex-fill pa-2 text-center border rounded-lg">
										12H <div :class="{'text-red': priceChange24H < 0, 'text-green': priceChange24H >= 0}">{{ toNumber(priceChange24H) }}%</div>
									</div>
									<div class="flex-fill pa-2 text-center border rounded-lg">
										24H <div :class="{'text-red': priceChange24H < 0, 'text-green': priceChange24H >= 0}">{{ toNumber(priceChange24H) }}%</div>
									</div>
								</div>

								<v-tabs v-model="currentPeriodTab" fixed-tabs>
									<v-tab v-for="period in periodsChanges" :value="period" variant="flat">{{ period }}</v-tab>
								</v-tabs>
								<v-window v-model="currentPeriodTab">
									<v-window-item v-for="period in periodsChanges" :value="period">
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
					<div class="d-flex justify-center align-center fill-width" style="height: 534px">
						<ChartTV v-show="pairInfo" :pair-addr="pairAddr" />
						<v-progress-circular v-show="!pairInfo" :size="50" :width="4" color="white" indeterminate />
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
			</div>

			<template v-if="tabContent === 'analyze'">
				<h2>Transactions</h2>
				<DexAnalyzeTxsTable />

				<h2 class="mt-5">Grouped by Wallets</h2>
				<DexAnalyzeTxsGroupTable />
			</template>

			<template v-if="tabContent === 'pair'">
				<div class="d-flex justify-space-between align-center" style="gap: 20px;">
					<v-card>
						<v-card-text>
							<v-list>
								<v-list-item @click=""><span class="text-disabled">Pair created:</span> <span>{{ pairMeta.created }}</span> <template v-slot:append><span class="text-disabled">{{ pairMeta.createdAgo }}</span></template></v-list-item>
								<v-list-item @click=""><span class="text-disabled">Creator: </span><v-btn variant="text" rounded density="comfortable">{{ shortAddress('0x123123124124123') }}</v-btn><template v-slot:append><v-btn text="EXP" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" /></template></v-list-item>
								<v-list-item @click=""><span class="text-disabled">Total Liquidity: </span> <span>{{ toCurrency(35112) }}</span></v-list-item>
								<v-list-item @click=""><span class="text-disabled">Pooled TANK: {{ toNumber(14542111) }}</span> <span>{{ toCurrency(17643) }}</span></v-list-item>
								<v-list-item @click=""><span class="text-disabled">Pooled BUSD:{{ toNumber(17643) }}</span> <span>{{ toCurrency(17643) }}</span></v-list-item>
								<v-list-item @click=""><span class="text-disabled">Pair: </span><v-btn variant="text" rounded density="comfortable">{{ shortAddress('0x123123124124123') }}</v-btn> <template v-slot:append><v-btn text="LPs" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" class="text-none" /> <v-btn text="EXP" append-icon="mdi-open-in-new" variant="text" size="small" rounded density="comfortable" class="text-none" /></template></v-list-item>
								<v-list-item @click=""><span class="text-disabled">TANK: </span><v-btn variant="text" rounded density="comfortable">{{ shortAddress('0x123123124124123') }}</v-btn> <template v-slot:append><v-btn text="HLD" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" class="text-none" /> <v-btn text="EXP" append-icon="mdi-open-in-new" variant="text" size="small" rounded density="comfortable" class="text-none" /></template></v-list-item>
								<v-list-item @click=""><span class="text-disabled">BUSD: </span><v-btn variant="text" rounded density="comfortable">{{ shortAddress('0x123123124124123') }}</v-btn> <template v-slot:append><v-btn text="HLD" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" class="text-none" /> <v-btn text="EXP" append-icon="mdi-open-in-new" variant="text" size="small" rounded density="comfortable" class="text-none" /></template></v-list-item>
							</v-list>
						</v-card-text>
					</v-card>

					<!-- Right side -->
					<div class="flex-fill">
						<v-tabs v-model="tabChartVariant">
							<v-tab value="liquidity" variant="flat" class="text-none">Liquidity</v-tab>
							<v-tab value="volume" variant="flat" class="text-none">Volume</v-tab>
							<v-tab value="share" variant="flat" class="text-none">Share</v-tab>
						</v-tabs>
						<LWChart
							:type="chartType"
							:data="chartData"
							:autosize="true"
							:chart-options="chartOptions"
							:series-options="seriesOptions"
							ref="lwChart"
						/>
					</div>
				</div>

				<h2 class="mt-7">Transactions Info</h2>
				<DexPairTxsTable />

				<h2 class="mt-7">Wallets</h2>
				<DexPairWalletsTable />
			</template>

    </v-container>
  </div>
</template>

<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { API_DOMAIN, PROJECT_NAME, shortAddress, formatNumber, toCurrency, toNumber } from "@/helpers/mixins";
import TableHistory from "@/components/TableHistory.vue";
import { mapActions, mapState } from "pinia";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { useChartStore } from "@/store/chartStore";
import ChartTV from "@/components/ChartTV.vue";
import Converter from "@/components/Converter.vue";
import DexAnalyzeTxsTable from "@/components/DexAnalyzeTxsTable.vue";
import DexAnalyzeTxsGroupTable from "@/components/DexAnalyzeTxsGroupTable.vue";
import LWChart from "@/components/LWChart.vue";
import DexPairTxsTable from "@/components/DexPairTxsTable.vue";
import DexPairWalletsTable from "@/components/DexPairWalletsTable.vue";
import { useMainStore } from "@/store/mainStore";

export default {
  name: "Pair",
  components: { DexPairWalletsTable, DexPairTxsTable, LWChart, DexAnalyzeTxsGroupTable, DexAnalyzeTxsTable, Converter, ChartTV, TableHistory, VSkeletonLoader },
  head: {
    title() { return { inner: this.title }},
    meta() { return [{ name: 'description', content: this.description, id: 'desc' }]},
  },
  // components: {TableHistory},
  data() { return {
    title: 'Console',
    description: import.meta.env.VITE_APP_PROJECT_NAME,
		tabContent: 'dex',
		periodsChanges: ['1H', '6H', '12H', '24H'],
		currentPeriodTab: '1H',
		tabChartVariant: 'liquidity',
		API_DOMAIN,
    pairInfoLoading: false,
		pairSelect: null,
    pairSymbol: '...',
    pairAddr: '',
    loadingOldTxs: true,

		pairMeta: {
			created: '2023-01-22',
			createdAgo: moment('2023-01-22').fromNow()
		},

		chartType: 'area',
		chartOptions: {height: 384},
		seriesOptions: {},
		chartData: [
			{ time: '2018-10-19', value: 35.98 },
			{ time: '2018-10-22', value: 35.75 },
			{ time: '2018-10-23', value: 35.65 },
			{ time: '2018-10-24', value: 34.12 },
			{ time: '2018-10-25', value: 35.84 },
			{ time: '2018-10-26', value: 35.24 },
			{ time: '2018-10-29', value: 35.99 },
			{ time: '2018-10-30', value: 37.71 },
			{ time: '2018-10-31', value: 38.14 },
			{ time: '2018-11-01', value: 37.95 },
			{ time: '2018-11-02', value: 37.66 },
			{ time: '2018-11-05', value: 38.02 },
			{ time: '2018-11-06', value: 37.73 },
			{ time: '2018-11-07', value: 38.30 },
			{ time: '2018-11-08', value: 38.30 },
			{ time: '2018-11-09', value: 38.34 },
			{ time: '2018-11-12', value: 38.00 },
			{ time: '2018-11-13', value: 37.72 },
			{ time: '2018-11-14', value: 38.29 },
			{ time: '2018-11-15', value: 38.49 },
			{ time: '2018-11-16', value: 38.59 },
			{ time: '2018-11-19', value: 38.18 },
			{ time: '2018-11-20', value: 36.76 },
			{ time: '2018-11-21', value: 37.51 },
			{ time: '2018-11-23', value: 37.39 },
			{ time: '2018-11-26', value: 37.77 },
			{ time: '2018-11-27', value: 38.36 },
			{ time: '2018-11-28', value: 39.06 },
			{ time: '2018-11-29', value: 39.42 },
			{ time: '2018-11-30', value: 39.01 },
			{ time: '2018-12-03', value: 39.15 },
			{ time: '2018-12-04', value: 37.69 },
			{ time: '2018-12-06', value: 37.88 },
			{ time: '2018-12-07', value: 37.41 },
			{ time: '2018-12-10', value: 37.35 },
			{ time: '2018-12-11', value: 36.84 },
			{ time: '2018-12-12', value: 36.98 },
			{ time: '2018-12-13', value: 36.76 },
			{ time: '2018-12-14', value: 36.34 },
			{ time: '2018-12-17', value: 36.21 },
			{ time: '2018-12-18', value: 35.65 },
			{ time: '2018-12-19', value: 35.19 },
			{ time: '2018-12-20', value: 34.62 },
			{ time: '2018-12-21', value: 33.75 },
			{ time: '2018-12-24', value: 33.07 },
			{ time: '2018-12-26', value: 34.14 },
			{ time: '2018-12-27', value: 34.47 },
			{ time: '2018-12-28', value: 34.35 },
			{ time: '2018-12-31', value: 34.05 },
			{ time: '2019-01-02', value: 34.37 },
			{ time: '2019-01-03', value: 34.64 },
			{ time: '2019-01-04', value: 35.81 },
			{ time: '2019-01-07', value: 35.43 },
			{ time: '2019-01-08', value: 35.72 },
			{ time: '2019-01-09', value: 36.06 },
			{ time: '2019-01-10', value: 35.82 },
			{ time: '2019-01-11', value: 35.63 },
			{ time: '2019-01-14', value: 35.77 },
			{ time: '2019-01-15', value: 35.83 },
			{ time: '2019-01-16', value: 35.90 },
			{ time: '2019-01-17', value: 35.91 },
			{ time: '2019-01-18', value: 36.21 },
			{ time: '2019-01-22', value: 34.97 },
			{ time: '2019-01-23', value: 36.89 },
			{ time: '2019-01-24', value: 36.24 },
			{ time: '2019-01-25', value: 35.78 },
			{ time: '2019-01-28', value: 35.37 },
			{ time: '2019-01-29', value: 36.08 },
			{ time: '2019-01-30', value: 35.43 },
			{ time: '2019-01-31', value: 36.57 },
			{ time: '2019-02-01', value: 36.79 },
			{ time: '2019-02-04', value: 36.77 },
			{ time: '2019-02-05', value: 37.15 },
			{ time: '2019-02-06', value: 37.17 },
			{ time: '2019-02-07', value: 37.68 },
			{ time: '2019-02-08', value: 37.60 },
			{ time: '2019-02-11', value: 37.00 },
			{ time: '2019-02-12', value: 37.24 },
			{ time: '2019-02-13', value: 37.03 },
			{ time: '2019-02-14', value: 37.26 },
			{ time: '2019-02-15', value: 37.77 },
			{ time: '2019-02-19', value: 37.55 },
			{ time: '2019-02-20', value: 37.79 },
			{ time: '2019-02-21', value: 38.47 },
			{ time: '2019-02-22', value: 38.61 },
			{ time: '2019-02-25', value: 38.57 },
			{ time: '2019-02-26', value: 38.80 },
			{ time: '2019-02-27', value: 38.53 },
			{ time: '2019-02-28', value: 38.67 },
			{ time: '2019-03-01', value: 39.10 },
			{ time: '2019-03-04', value: 38.73 },
			{ time: '2019-03-05', value: 38.72 },
			{ time: '2019-03-06', value: 38.61 },
			{ time: '2019-03-07', value: 38.38 },
			{ time: '2019-03-08', value: 38.19 },
			{ time: '2019-03-11', value: 39.17 },
			{ time: '2019-03-12', value: 39.49 },
			{ time: '2019-03-13', value: 39.56 },
			{ time: '2019-03-14', value: 39.87 },
			{ time: '2019-03-15', value: 40.47 },
			{ time: '2019-03-18', value: 39.92 },
			{ time: '2019-03-19', value: 39.78 },
			{ time: '2019-03-20', value: 39.47 },
			{ time: '2019-03-21', value: 40.05 },
			{ time: '2019-03-22', value: 39.46 },
			{ time: '2019-03-25', value: 39.18 },
			{ time: '2019-03-26', value: 39.63 },
			{ time: '2019-03-27', value: 40.21 },
			{ time: '2019-03-28', value: 40.42 },
			{ time: '2019-03-29', value: 39.98 },
			{ time: '2019-04-01', value: 40.31 },
			{ time: '2019-04-02', value: 40.02 },
			{ time: '2019-04-03', value: 40.27 },
			{ time: '2019-04-04', value: 40.41 },
			{ time: '2019-04-05', value: 40.42 },
			{ time: '2019-04-08', value: 40.71 },
			{ time: '2019-04-09', value: 41.04 },
			{ time: '2019-04-10', value: 41.08 },
			{ time: '2019-04-11', value: 41.04 },
			{ time: '2019-04-12', value: 41.30 },
			{ time: '2019-04-15', value: 41.78 },
			{ time: '2019-04-16', value: 41.97 },
			{ time: '2019-04-17', value: 42.57 },
			{ time: '2019-04-18', value: 42.43 },
			{ time: '2019-04-22', value: 42.00 },
			{ time: '2019-04-23', value: 41.99 },
			{ time: '2019-04-24', value: 41.85 },
			{ time: '2019-04-25', value: 42.93 },
			{ time: '2019-04-26', value: 43.08 },
			{ time: '2019-04-29', value: 43.45 },
			{ time: '2019-04-30', value: 43.53 },
			{ time: '2019-05-01', value: 43.42 },
			{ time: '2019-05-02', value: 42.65 },
			{ time: '2019-05-03', value: 43.29 },
			{ time: '2019-05-06', value: 43.30 },
			{ time: '2019-05-07', value: 42.76 },
			{ time: '2019-05-08', value: 42.55 },
			{ time: '2019-05-09', value: 42.92 },
			{ time: '2019-05-10', value: 43.15 },
			{ time: '2019-05-13', value: 42.28 },
			{ time: '2019-05-14', value: 42.91 },
			{ time: '2019-05-15', value: 42.49 },
			{ time: '2019-05-16', value: 43.19 },
			{ time: '2019-05-17', value: 43.54 },
			{ time: '2019-05-20', value: 42.78 },
			{ time: '2019-05-21', value: 43.29 },
			{ time: '2019-05-22', value: 43.30 },
			{ time: '2019-05-23', value: 42.73 },
			{ time: '2019-05-24', value: 42.67 },
			{ time: '2019-05-28', value: 42.75 },
		],
  } },

  async created() {
		this.pairAddr = this.$route.params.pairAddr.toString().toLowerCase()

    if(!this.pairAddr.startsWith('0x'))
      return this.$router.replace({name: 'Console'})
  },
	watch: {
		'$route.params.pairAddr'(newVal, oldVal) {
			console.log('watch $route.params.pairAddr', newVal, oldVal)
			if(!newVal) return
			window.tvWidget.activeChart().setSymbol(newVal)
		},
    async activeSymbol(newVal, oldVal) {
      console.log('activeSymbol change', newVal, oldVal)
      if(!newVal) return // on resetState
      this.pairSymbol = newVal.symbol
      this.pairSelect = newVal.full_name
      this.pairAddr = newVal.pair_addr
      this.updateTitle()
      if(oldVal && (newVal.type !== oldVal.type || newVal.pair_addr !== oldVal.pair_addr)) {
        this.$router.push({params: { pairAddr: this.pairAddr }}).then()
      }
      this.pairInfoLoading = true
      await this.getPairInfo(newVal.pair_id)
      this.pairInfoLoading = false
    },
		pairSelect(newVal, oldVal) {
			if(!oldVal) return
			console.log('pairSelect', newVal, oldVal)
			window.tvWidget.activeChart().setSymbol(newVal)
		},
    lastPrice() {
      this.updateTitle()
    }
  },
  computed: {
    PROJECT_NAME() { return PROJECT_NAME },
    ...mapState(useMainStore, ['chains']),
    ...mapState(useChartStore, ['activeSymbol', 'pairInfo', 'similarityPools', 'lastPrice', 'leftToken', 'rightToken', "lastTXs"]),
		iconToken0() {
			const iconFolder = !this.chains || !this.activeSymbol ? null : this.chains[this.activeSymbol.chain_id]['icon_folder']
			return !this.pairInfo || !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${this.pairInfo.token0.address.toLowerCase().slice(0,4)}/${this.pairInfo.token0.address.toLowerCase()}/default.png`
		},
    tokenTitle() { return this.pairInfo ?  this.pairInfo.token0.name : 'Loading...' },
		pairSelectItems() {
			// return this.pairInfo.pool.similarity_pools.map(i => {return { value: `None:${i.name}:${i.address}`, title: i.name }})
			return this.similarityPools.map(i => ({ value: i.full_name, title: i.symbol }))
		},
    // buySellRate() { return !this.pairInfo ? 50 : Math.round(this.buyVolume24 / (this.buyVolume24 + this.sellVolume24) * 100) },
    // buyVolume24() { return this.pairInfo ? Math.round(this.pairInfo.pool.buy_volume_24h) : 0 },
    // sellVolume24() { return this.pairInfo ? Math.round(this.pairInfo.pool.sell_volume_24h) : 0 },
    // buyTxCount24() { return this.pairInfo ? this.pairInfo.pool.buy_tx_count_24h : 0 },
    // sellTxCount24() { return this.pairInfo ? this.pairInfo.pool.sell_tx_count_24h : 0 },
    // holders() { return this.pairInfo ? this.pairInfo.token0.holders : 0 },
    // totalSupply() { return this.pairInfo ? this.pairInfo.token0.total_supply : 0 },
    // volume24h() { return this.pairInfo ? this.pairInfo.pool.volume_24h : 0 },
    // liquidity() { return this.pairInfo ? this.pairInfo.pool.total_liquidity : 0 },
    // txCount24() { return this.pairInfo ? this.pairInfo.pool.tx_count_24h : 0 },
    // marketCap() { return this.pairInfo ? this.pairInfo.token0.total_supply * this.lastPrice : 0 },
    priceChange24H() { return this.pairInfo ? this.pairInfo.pool.price_change_24h : 0 },
  },
  methods: {
		toCurrency,
    shortAddress, toNumber, formatNumber,  // from mixins
    ...mapActions(useChartStore, {getPairInfo: 'getPairInfo', resetState: 'resetState', loadExchanges: 'loadExchanges'}),

    updateTitle() {
      this.title = `${this.pairSymbol} - ${formatNumber(this.lastPrice)}`
      this.description = `Analyse ${this.pairSymbol} of ${this.PROJECT_NAME} | ${this.pairAddr}`
      this.$emit('updateHead') // update title
    },
  }
}
</script>
