<template>
	<v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
		<div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" /></div>
		<div v-else class="d-flex justify-space-between align-center flex-wrap pa-2">

			<div class="d-flex align-center flex-wrap"> <!-- left side -->
				<div v-if="entityIcon" class="mr-2" style="width: 80px; height: 80px;border-radius: 50%;overflow: hidden;">
					<TokenIcon :src="entityIcon" width="80" />
				</div>
				<div class="">
					<div class="d-flex align-center flex-wrap">
						<h2 class="fs24 font-weight-regular mr-3" style="color: #D9DCEE">{{ entityInfo.name || entityId }}</h2>
						<v-btn @click="dialogInfo = true" size="small" icon="mdi-information-outline" class="mr-3"></v-btn>
						<div class="fs18 mr-3">${{ formatNumber(123456789, true) }}</div>
						<div class="fs16 text-green mr-3">+${{ formatNumber(421.44, true) }}</div>
					</div>
					<div class="mt-2">
						<v-chip text="Dev" color="grey" size="small" class="mr-2" />
						<v-chip text="ERC 20 Token Deployer" color="grey" size="small" class="mr-2" />
					</div>
				</div>
			</div>

			<div> <!-- right side -->
				<v-btn-toggle v-model="tab" mandatory density="comfortable" variant="outlined">
					<v-btn value="portfolio" class="text-none" >Portfolio</v-btn>
					<v-btn value="finances" class="text-none" >Finances</v-btn>
					<v-btn value="transactions" class="text-none" >Transactions</v-btn>
				</v-btn-toggle>
			</div>
		</div>

		<v-divider class="mt-4 mb-4" />

		<div v-show="tab === 'portfolio'">
			<v-skeleton-loader v-if="loading" type="table-tbody"  class="" style="width: 100%" />
			<template v-else-if="entityInfo">
				<div class="d-flex">
					<div>
						<pre>{{ entityInfo }}</pre>
					</div>
					<div class="flex-fill ms-auto" style="max-width: 700px">
						<h3>Balances History</h3>
						<LWChart
							:data="chart1Data" autosize
							:chart-options="{height: 350}"
							ref="lwChart" class="mb-8"
						/>
						<h3>Profit & Loss</h3>
						<LWChart
							:data="chart1Data" autosize
							:chart-options="{height: 350}"
							ref="lwChart"
						/>
					</div>
				</div>
			</template>
		</div>

		<div v-show="tab === 'finances'">
			Finances content
		</div>

		<div v-show="tab === 'transactions'">
			Transactions content
		</div>

		<v-dialog v-model="dialogInfo" max-width="500px">
			<v-card rounded class="rounded-xl">
				<v-card-text class="py-10 px-8">
					<pre>{{ entityInfo }}</pre>
				</v-card-text>
			</v-card>
		</v-dialog>

	</v-container>
</template>

<script>
import { fetchAddress, fetchEntity } from "@/api";
import TokenIcon from "@/components/UI/TokenIcon.vue";
import { API_DOMAIN, formatNumber } from "@/helpers/mixins";
import LWChart from "@/components/LWChart.vue";

export default {
  // name: 'Entity',
	components: { LWChart, TokenIcon },
	head() { return  {
		title: this.pageTitle,
	}},
	data() { return {
		API_DOMAIN,
		pageTitle: 'Loading...',
		loading: true,
		type: null,
		entityId: null,
		entityInfo: null,
		tab: 'portfolio', // portfolio | finances | transactions
		dialogInfo: false,
		chart1Data: [
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
		]
	}},
	created() {
		this.loadEntity()
	},
	watch: {
		'$route.params.id'(newVal, oldVal) {
			// console.log('watch $route.params.id', newVal, oldVal)
			if(!oldVal || !newVal || newVal.startsWith('0x')) return // load page or redirect to token/wallet
			this.loadEntity()
		}
	},
	computed: {
		entityIcon() {
			if(this.type !== 'Entity') return ''
			return API_DOMAIN + `/images/entities/${this.entityInfo.uuid.slice(0,1)}/${this.entityInfo.uuid}.png`
		}
	},
	methods: {
		formatNumber,

		async loadEntity() {
			this.entityId = this.$route.params.id.toString().toLowerCase()
			this.type = this.$route.name // Entity || Address
			// console.log(this.type)
			this.loading = true
			let data
			if(this.type === 'Entity') {
				data = await fetchEntity(this.entityId)
			} else {
				data = await fetchAddress(this.entityId)
			}
			data = data.data
			this.loading = false
			if(!data.success) {
				this.$router.replace({name: 'Console'})
				return
			}
			this.entityInfo = data.result
			this.updateTitle()
		},
		updateTitle() {
			this.pageTitle = !this.entityInfo ? '' : this.entityInfo.name
		},
	}
}
</script>
