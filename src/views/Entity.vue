<template>
	<v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
		<div class="d-flex align-center">
			<h1 class="text-h4 mt-2 mb-2">ENTITY</h1>
		</div>
		<div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" /></div>
		<template v-else-if="item">
			<pre>{{ item }}</pre>
		</template>
	</v-container>
</template>

<script>
import { fetchEntity } from "@/api";

export default {
  name: 'Entity',
	data() { return {
		id: null,
		loading: true,
		item: null
	}},
	created() {
		this.loadData()
	},
	// beforeRouteUpdate(to, from) { console.log('beforeRouteUpdate') }, // not work ??
	watch: {
		'$route.params.id'(newVal, oldVal) {
			console.log('watch $route.params.id', newVal, oldVal)
			if(!oldVal || !newVal || newVal.startsWith('0x')) return // load page or redirect to token/wallet
			this.loadData()
		}
	},
	methods: {
		async loadData() {
			this.id = this.$route.params.id.toString().toLowerCase()
			this.loading = true
			const { data } = await fetchEntity(this.id)
			this.loading = false
			if(!data.success) {
				this.$router.replace({name: 'Console'})
				return
			}
			this.item = data.result
		}
	}
}
</script>
