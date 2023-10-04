<template>
	<v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
		<div class="d-flex align-center">
			<h1 class="text-h4 mt-2 mb-2">{{ type.toUpperCase() }} {{ item?.name || item?.address }}</h1>
		</div>
		<div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" /></div>
		<template v-else-if="item">
			<pre>{{ item }}</pre>
		</template>
	</v-container>
</template>

<script>
import { fetchAddress } from "@/api";

export default {
  name: 'Address',
  head: () => ({ title: 'Address' }),
	data() { return {
		id: null,
		loading: true,
		type: '',
		item: null
	}},
	created() {
		this.loadData()
	},
	// beforeRouteUpdate(to, from) { console.log('beforeRouteUpdate') }, // not work ??
	watch: {
		// '$route.name'(newVal) {
		// 	console.log('watch $route.name', newVal)
		// 	if(['Token', 'Wallet'].includes(newVal)) {
		// 		this.loadData()
		// 	}
		// },
		'$route.params.id'(newVal, oldVal) {
			// console.log('watch $route.params.id', newVal, oldVal)
			if (!oldVal || !newVal || !newVal.startsWith('0x')) return // load page or redirect to entity
			this.loadData()
		}
	},
	methods: {
		async loadData() {
			this.id = this.$route.params.id.toString().toLowerCase()
			this.type = this.$route.name // Token || Wallet

			this.loading = true
			const { data } = await fetchAddress(this.id)
			this.loading = false
			if(!data.success) {
				this.$router.replace({name: 'Console'}); return
			}
			this.item = data.result
			this.type = this.item.type
		}
	}
}
</script>
