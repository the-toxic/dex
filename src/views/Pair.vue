<template>
	<v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">

		<v-card class="mb-3" color="transparent" elevation="0" :loading="pairInfoLoading">
			<v-card-text class="d-flex justify-space-between align-center flex-wrap pa-2">

				<div class="d-flex align-center flex-wrap">
					<v-btn icon="mdi-arrow-left" :to="{name: 'Console'}" :active="false" size="x-large" density="compact" class="mr-2" />
					<div class="mr-2" :class="{'bg-blue-grey-darken-3': !pairInfo || !iconToken0 || pairInfoLoading}" style="width: 40px; height: 40px;border-radius: 50%;overflow: hidden;">
						<TokenIcon v-if="!pairInfoLoading" :src="iconToken0" width="40" />
					</div>
					<h2 class="fs24 font-weight-regular mr-3" style="color: #D9DCEE">{{ tokenTitle }}</h2>
					<v-btn size="small" icon="mdi-star-outline" class="mr-3"></v-btn>
					<v-btn size="small" icon="mdi-bell" class="mr-3"></v-btn>
					<v-btn size="small" icon="mdi-information-outline" class="mr-3"></v-btn>
					<div class="fs18 mr-3">{{ formatNumber(lastPrice) }} {{ rightToken }}</div>
					<div class="fs16 text-disabled mr-3">${{ formatNumber(token0PriceInUSD) }}</div>
				</div>
				<!-- <div v-if="pairInfo" class="lh-1_2">
					<span class="mr-2">Token: {{shortAddress(pairInfo.token0.address) }} <CopyLabel icon :text="pairInfo.token0.address" icon-color="#72747F" /></span>
					<span>Pair: {{ shortAddress(pairAddr) }} <CopyLabel icon :text="pairAddr" icon-color="#72747F" /></span>
				</div>-->

				<div> <!-- right side -->
					<v-btn-toggle v-model="tabContent" mandatory density="comfortable" variant="outlined" class="mr-5">
						<v-btn value="dex" class="text-none" >DEX</v-btn>
						<v-btn value="analyze" class="text-none" >Analyze</v-btn>
						<v-btn value="pair" class="text-none" >Pair</v-btn>
					</v-btn-toggle>

<!--            <v-select v-model="pairSelect" :items="similarityItems" :loading="pairInfoLoading"  variant="outlined" class="d-inline-block va-middle" hide-details density="compact" />-->
					<v-menu v-if="similarityPools" location="bottom">
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" variant="outlined" :active="false" append-icon="mdi-menu-down" class="text-none">
								{{ pairSymbol }} | {{ chainName }}
							</v-btn> <!-- | exchange | -->
						</template>
						<v-list>
							<v-list-item v-for="item in similarityPools" :to="{name: 'Pair', params: {id: item.pair_addr}}">
								{{ item.symbol }} | {{ chains[item.chain_id]['name'] }}
							</v-list-item><!-- | item.exchange | -->
						</v-list>
					</v-menu>
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
					<v-skeleton-loader v-if="!pairInfo || pairInfoLoading" type="image@2"  class="" style="height: 334px; width: 391px" />
					<v-card v-else>
						<v-card-text>
							<div class="d-flex mb-3" style="gap: 10px">
								<div class="flex-fill pa-2 text-center border rounded-lg">
									1H <div :class="{'text-red': pairInfo.stats.h1.percent < 0, 'text-green': pairInfo.stats.h1.percent >= 0}">{{ toNumber(pairInfo.stats.h1.percent) }}%</div>
								</div>
								<div class="flex-fill pa-2 text-center border rounded-lg">
									6H <div :class="{'text-red': pairInfo.stats.h6.percent < 0, 'text-green': pairInfo.stats.h6.percent >= 0}">{{ toNumber(pairInfo.stats.h6.percent) }}%</div>
								</div>
								<div class="flex-fill pa-2 text-center border rounded-lg">
									12H <div :class="{'text-red': pairInfo.stats.h12.percent < 0, 'text-green': pairInfo.stats.h12.percent >= 0}">{{ toNumber(pairInfo.stats.h12.percent) }}%</div>
								</div>
								<div class="flex-fill pa-2 text-center border rounded-lg">
									24H <div :class="{'text-red': pairInfo.stats.h24.percent < 0, 'text-green': pairInfo.stats.h24.percent >= 0}">{{ toNumber(pairInfo.stats.h24.percent) }}%</div>
								</div>
							</div>

							<v-tabs v-model="currentPeriodTab" fixed-tabs>
								<v-tab v-for="period in periodsChanges" :value="period" variant="flat">{{ period }}</v-tab>
							</v-tabs>
							<v-window v-model="currentPeriodTab">
								<v-window-item v-for="period in periodsChanges" :value="period">
									<div class="pa-4 rounded border d-flex">
										<div>
											<p class="text-disabled">TXs</p><p>{{ toNumber(pairInfo.stats[currPeriodKey]['txs']) }}</p>
											<p class="text-disabled mt-4">VOLUME</p><p>{{ formatBigNumber(pairInfo.stats[currPeriodKey]['volume'], 1000) }}</p>
											<p class="text-disabled mt-4">MAKERS</p><p>{{ toNumber(pairInfo.stats[currPeriodKey]['makers']) }}</p>
										</div>
										<v-divider vertical class="mx-4" />
										<div class="fill-width">
											<div class="d-flex justify-space-between">
												<div class=""><p class="text-disabled">BUYS</p><p>{{ toNumber(pairInfo.stats[currPeriodKey]['buy']) }}</p></div>
												<div class="text-right"><p class="text-disabled">SELLS</p><p>{{ toNumber(pairInfo.stats[currPeriodKey]['sell']) }}</p></div>
											</div>
											<v-progress-linear rounded height="5" :model-value="Math.round(pairInfo.stats[currPeriodKey]['buy'] / (pairInfo.stats[currPeriodKey]['buy'] + pairInfo.stats[currPeriodKey]['sell']) * 100)" color="#51A49A" bg-color="#DE5F57" bg-opacity="1" />

											<div class="d-flex justify-space-between mt-2">
												<div class=""><p class="text-disabled">BUY VOL</p><p>{{ formatBigNumber(pairInfo.stats[currPeriodKey]['buy_volume'], 1000) }}</p></div>
												<div class="text-right"><p class="text-disabled">SELL VOL</p><p>{{ formatBigNumber(pairInfo.stats[currPeriodKey]['sell_volume'], 1000) }}</p></div>
											</div>
											<v-progress-linear rounded height="5" :model-value="Math.round(pairInfo.stats[currPeriodKey]['buy_volume'] / (pairInfo.stats[currPeriodKey]['buy_volume'] + pairInfo.stats[currPeriodKey]['sell_volume']) * 100)" color="#51A49A" bg-color="#DE5F57" bg-opacity="1" />

											<div class="d-flex justify-space-between mt-2">
												<div class=""><p class="text-disabled">BUYERS</p><p>{{ toNumber(pairInfo.stats[currPeriodKey]['buyers']) }}</p></div>
												<div class="text-right"><p class="text-disabled">SELLERS</p><p>{{ toNumber(pairInfo.stats[currPeriodKey]['sellers']) }}</p></div>
											</div>
											<v-progress-linear rounded height="5" :model-value="Math.round(pairInfo.stats[currPeriodKey]['buyers'] / (pairInfo.stats[currPeriodKey]['buyers'] + pairInfo.stats[currPeriodKey]['sellers']) * 100)" color="#51A49A" bg-color="#DE5F57" bg-opacity="1" />
										</div>
									</div>

								</v-window-item>
							</v-window>

						</v-card-text>
					</v-card>

					<Converter v-if="pairInfo && !pairInfoLoading" :token0="pairInfo.token0" :token1="pairInfo.token1" :rate="lastPrice" :chainId="chainId" class="mt-5"/>
					<v-skeleton-loader v-else class="mt-5" style="height: 180px" />
				</div>
				<div class="d-flex justify-center align-center fill-width" style="height: 534px">
					<ChartTV v-show="pairInfo && !pairInfoLoading" :pair-addr="pairAddr" />
					<v-progress-circular v-show="!pairInfo || pairInfoLoading" :size="50" :width="4" color="white" indeterminate />
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
			<v-card class="mt-2 mb-8">
				<TableHistory />
			</v-card>
		</div>

		<template v-if="tabContent === 'analyze'">
<!--				<h2>Transactions</h2>-->
<!--				<DexAnalyzeTxsTable />-->

			<h2 class="mt-5">Grouped by Addresses</h2>
			<DexAnalyzeTxsGroupTable  :chainId="chainId" :pairId="pairId" />
		</template>

		<template v-if="tabContent === 'pair'">
			<div class="d-flex justify-space-between align-center" style="gap: 20px;">
				<v-card min-width="400" height="400">
					<div v-if="!pairInfo || pairInfoLoading" class="d-flex align-center justify-center fill-height">
						<v-progress-circular :size="50" :width="4" color="white" indeterminate />
					</div>
					<v-list v-else>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 120px;">Pair created:</span></template>
							{{ new Date(pairInfo.pair.created_at).toJSON().split('T')[0] }}
							<template v-slot:append><span class="text-disabled">{{ moment(pairInfo.pair.created_at).fromNow() }}</span></template>
						</v-list-item>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 105px;">Creator: </span></template>
							<v-btn @click="$clipboard(pairInfo.pair.created_by)" variant="text" rounded density="comfortable" class="text-none">{{ shortAddress(pairInfo.pair.created_by) }}</v-btn>
							<template v-slot:append><v-btn text="EXP" :href="`${explorerDomain}/address/${pairInfo.pair.created_by}`" target="_blank" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" /></template>
						</v-list-item>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 120px;">Total Liquidity: </span></template>
							${{ formatNumber(pairInfo.pair.token0_reserve * token0PriceInUSD + pairInfo.pair.token1_reserve * token1PriceInUSD) }}
						</v-list-item>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 120px;">Pooled {{ pairInfo.token0.symbol }}:</span></template>
							<div>{{ formatNumber(pairInfo.pair.token0_reserve, true) }}</div>
							<template v-slot:append>${{ formatNumber(pairInfo.pair.token0_reserve * token0PriceInUSD, true) }}</template>
						</v-list-item>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 120px;">Pooled {{ pairInfo.token1.symbol }}:</span></template>
							<span>{{ formatNumber(pairInfo.pair.token1_reserve, true) }}</span>
							<template v-slot:append>${{ formatNumber(pairInfo.pair.token1_reserve * token1PriceInUSD, true) }}</template>
						</v-list-item>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 120px;">Pair: </span></template>
							<v-btn @click="$clipboard(pairInfo.pair.address)" variant="text" rounded density="comfortable" class="text-none">{{ shortAddress(pairInfo.pair.address) }}</v-btn>
							<template v-slot:append>
								<v-btn text="LPs" :href="`${explorerDomain}/token/tokenholderchart/${pairInfo.pair.address}`" target="_blank" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" class="text-none" />
								<v-btn text="EXP" :href="`${explorerDomain}/token/${pairInfo.token0.address}?a=${pairInfo.pair.address}`" target="_blank" append-icon="mdi-open-in-new" variant="text" size="small" rounded density="comfortable" class="text-none" />
							</template>
						</v-list-item>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 120px;">{{ pairInfo.token0.symbol }}: </span></template>
							<v-btn :to="{name: 'Token', params: {id: pairInfo.token0.address}}" variant="text" rounded density="comfortable" class="text-none">{{ shortAddress(pairInfo.token0.address) }}</v-btn>
							<template v-slot:append>
								<v-btn text="HLD" :href="`${explorerDomain}/token/tokenholderchart/${pairInfo.token0.address}`" target="_blank" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" class="text-none" />
								<v-btn text="EXP" :href="`${explorerDomain}/token/${pairInfo.token0.address}`" target="_blank" append-icon="mdi-open-in-new" variant="text" size="small" rounded density="comfortable" class="text-none" />
							</template>
						</v-list-item>
						<v-list-item @click="">
							<template v-slot:prepend><span class="ellipsis text-disabled text-left" style="width: 120px;">{{ pairInfo.token1.symbol }}: </span></template>
							<v-btn :to="{name: 'Token', params: {id: pairInfo.token1.address}}" variant="text" rounded density="comfortable" class="text-none">{{ shortAddress(pairInfo.token1.address) }}</v-btn>
							<template v-slot:append>
								<v-btn text="HLD" :href="`${explorerDomain}/token/tokenholderchart/${pairInfo.token1.address}`" target="_blank" append-icon="mdi-open-in-new" size="small" variant="text" rounded density="comfortable" class="text-none" />
								<v-btn text="EXP" :href="`${explorerDomain}/token/${pairInfo.token1.address}`" target="_blank" append-icon="mdi-open-in-new" variant="text" size="small" rounded density="comfortable" class="text-none" />
							</template>
						</v-list-item>
					</v-list>
				</v-card>

				<!-- Right side -->
				<div class="flex-fill">
					<v-tabs v-model="tabChartVariant">
						<v-tab value="liquidity" variant="flat" class="text-none">Liquidity</v-tab>
<!--							<v-tab value="volume" variant="flat" class="text-none">Volume</v-tab>-->
<!--							<v-tab value="share" variant="flat" class="text-none">Share</v-tab>-->
					</v-tabs>
					<LWChart
						:data="chartData" autosize
						:chart-options="{height: 350}"
						:series-options="{}" ref="lwChart"
					/>
				</div>
			</div>

			<h2 class="mt-7">Liquidity TXs Info</h2>
			<DexPairLiquidityTable v-if="pairId && chainId && pairInfo" :pairId="pairId" :chainId="chainId" :pairInfo="pairInfo" />

<!--				<h2 class="mt-7">Wallets</h2>-->
<!--				<DexPairWalletsTable />-->
		</template>

	</v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// @ts-ignore
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range';
import { API_DOMAIN, formatBigNumber, formatNumber, shortAddress, toCurrency, toNumber } from "@/helpers/mixins";
import TableHistory from "@/components/TableHistory.vue";
import { mapActions, mapState } from "pinia";
import { useChartStore } from "@/store/chartStore";
import ChartTV from "@/components/ChartTV.vue";
import Converter from "@/components/Converter.vue";
import DexAnalyzeTxsTable from "@/components/DexAnalyzeTxsTable.vue";
import DexAnalyzeTxsGroupTable from "@/components/DexAnalyzeTxsGroupTable.vue";
import LWChart from "@/components/LWChart.vue";
import DexPairLiquidityTable from "@/components/DexPairLiquidityTable.vue";
import DexPairWalletsTable from "@/components/DexPairWalletsTable.vue";
import { useMainStore } from "@/store/mainStore";
import TokenIcon from "@/components/UI/TokenIcon.vue";
import { fetchLiquidityChart } from "@/api";

export default defineComponent({
  name: "Pair",
  components: { TokenIcon, DexPairWalletsTable, DexPairLiquidityTable, LWChart, DexAnalyzeTxsGroupTable, DexAnalyzeTxsTable, Converter, ChartTV, TableHistory },
  head() { return  {
    title: this.pageTitle,
    // meta: [{name: 'description', content: this.pageDescription}]
  }},
  data() { return {
    pageTitle: 'Load pair...',
    // pageDescription: '',
		tabContent: 'dex', // dex | analyze | pair
		periodsChanges: ['1H', '6H', '12H', '24H'],
		currentPeriodTab: '1H',
		tabChartVariant: 'liquidity',
		API_DOMAIN,
    pairInfoLoading: false,
    pairAddr: '',
    loadingOldTxs: true,

		// pairMeta: {
		// 	created: '2023-01-22',
		// 	createdAgo: moment('2023-01-22').fromNow()
		// },

		chartType: 'area',
		chartData: [],
  } },

  async created() {
		this.pairAddr = this.$route.params.id.toString().toLowerCase()

    if(this.$route.hash) {
      const hash = this.$route.hash.slice(1)
      if(['dex', 'analyze', 'pair'].includes(hash))
        this.tabContent = hash
    }
  },
	unmounted() {
		this.resetState() // clear chart store
	},
	watch: {
		'$route.params.id'(newVal, oldVal) {
			if(this.$route.name !== 'Pair') return; // fix bug - open entity in DEX page
			console.log('watch $route.params.id', newVal, oldVal)
			if(typeof newVal === 'undefined' || newVal === null) return // undefined on unmount, null on resetState

			if(!oldVal) { // on load page
				window.tvWidget?.activeChart().setSymbol(newVal)
			}
			// on change symbol
			this.pairInfoLoading = true
			const similarityItem = this.similarityPools.find(({pair_addr}) => pair_addr === newVal);
			if(similarityItem) { // global search on similarityPools or double call on change pair select
				this.setActiveSymbol(similarityItem)
				window.tvWidget?.activeChart().setSymbol(similarityItem.full_name)
				return
			}
			// console.warn('!!!')
			window.tvWidget?.activeChart().setSymbol(newVal+'^'+Math.random()) // disable cache

			this.pairInfoLoading = false
			// 	window.tvWidget.remove()
			// 	window.tvWidget = null
			// 	this.resetState()
			// 	initChart(newVal)
		},

    async activeSymbol(newVal, oldVal) {
      console.log('watch activeSymbol', newVal, oldVal)
      if(!newVal) return // on resetState
      this.pairAddr = newVal.pair_addr
      this.updateTitle()
      if(oldVal && (newVal.type !== oldVal.type || newVal.pair_addr !== oldVal.pair_addr)) {
        this.$router.push({...this.$route, params: { id: this.pairAddr }}).then()
      }
      this.pairInfoLoading = true
      await this.getPairInfo(newVal.pair_id)
      this.pairInfoLoading = false

			this.loadLiquidityChart().then()
    },

		// pairSelect(newVal, oldVal) {
		// 	if(!newVal || !oldVal) return
		// 	console.log('watch pairSelect', newVal, oldVal)
		// 	const symbolItem = this.similarityPools.find(({ full_name }) => full_name === newVal);
		// 	if(!symbolItem) console.error('Not found selected pair in similarityPools')
		// 	this.setActiveSymbol(symbolItem).then()
		// 	window.tvWidget.activeChart().setSymbol(newVal)
		// },
    async tabContent(newVal) {
      this.$router.replace({ hash: '#'+newVal }) // add ...this.$route for save url query on tab change
    },
    token0PriceInUSD() {
      this.updateTitle()
    }
  },
  computed: {
    ...mapState(useMainStore, ['chains']),
    ...mapState(useChartStore, ['activeSymbol', 'pairInfo', 'similarityPools', 'lastPrice', 'leftToken', 'rightToken', 'lastTXs', 'chainName', 'chainId', 'pairId', 'pairSymbol', 'exchange', 'nativeWrappedSymbol', 'explorerDomain']),

		iconToken0() {
			const iconFolder = !this.chains || !this.activeSymbol ? null : this.chains[this.chainId]['icon_folder']
			return !this.pairInfo || !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${this.pairInfo.token0.address.toLowerCase().slice(0,4)}/${this.pairInfo.token0.address.toLowerCase()}/default.png`
		},
    tokenTitle() { return this.pairInfo && !this.pairInfoLoading ?  this.pairInfo.token0.name : 'Loading...' },
		// similarityItems() {
		// 	// return this.pairInfo.pool.similarity_pools.map(i => {return { value: `None:${i.name}:${i.address}`, title: i.name }})
		// 	return this.similarityPools.map(i => ({ id: i.pair_addr, title: i.symbol }))
		// },
		token0PriceInUSD() {
			if(!this.pairInfo || !this.activeSymbol || !this.chains) return 0
			if(this.pairInfo.token1.is_stable) return this.lastPrice

			const nativeSymbolPrice = this.chains[this.chainId]['native_symbol_price'] || 1
			return this.lastPrice * nativeSymbolPrice
		},
		token1PriceInUSD() {
			if(!this.pairInfo || !this.activeSymbol || !this.chains) return 0
			if(this.pairInfo.token1.is_stable) return 1
      if(this.pairInfo.token1.symbol === this.nativeWrappedSymbol) {
        return this.chains[this.chainId]['native_symbol_price'] || 1
      }
      return 0
		},
    currPeriodKey() {
      return this.currentPeriodTab === '1H' ? 'h1' : (this.currentPeriodTab === '6H' ? 'h6' : (this.currentPeriodTab === '12H' ? 'h12' : (this.currentPeriodTab === '24H' ? 'h24' : 'h1') ))
    },
    // buySellRate() { return !this.pairInfo ? 50 : Math.round(this.buyVolume24 / (this.buyVolume24 + this.sellVolume24) * 100) },
  },
  methods: {
    moment, formatBigNumber, toCurrency, shortAddress, toNumber, formatNumber,  // from mixins
    ...mapActions(useChartStore, {getPairInfo: 'getPairInfo', setActiveSymbol: 'setActiveSymbol', resetState: 'resetState', loadExchanges: 'loadExchanges'}),

		async loadLiquidityChart() {
			const { data } = await fetchLiquidityChart({chainId: this.chainId, pairId: this.pairId})
			if(data.success) {
				this.chartData = data.result.data
			}
		},
    updateTitle() {
      const chain = (!this.activeSymbol || !this.chains) ? '' : this.chains[this.chainId]['name']
      this.pageTitle = !this.activeSymbol ? '' : `$${formatNumber(this.token0PriceInUSD)} ${this.pairSymbol} - ${this.tokenTitle} | ${this.activeSymbol.exchange} / ${chain}`
      // this.pageDescription = `Analyse ${this.pairSymbol} of ${this.PROJECT_NAME} | ${this.pairAddr}`
    },
  }
})
</script>
