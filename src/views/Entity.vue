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
				<pre>{{ entityInfo }}</pre>
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

export default {
  // name: 'Entity',
	components: { TokenIcon },
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
		dialogInfo: false
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
			console.log(this.type)
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
