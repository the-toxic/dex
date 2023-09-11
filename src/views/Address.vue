<template>
	<v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
		<div class="d-flex align-center">
			<h1 class="text-h4 mt-2 mb-2">{{ type.toUpperCase() }} {{ item?.address }}</h1>
		</div>
		<div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" /></div>
		<template v-else-if="item">
			<div>ID: {{ item.id }}</div>
			<div>Type: {{ item.type }}</div>
			<div>Name: {{ item.name }}</div>
			<div>Address: {{ item.address }}</div>
		</template>
	</v-container>
</template>

<script>
import { fetchAddress } from "@/api";

export default {
  name: 'Address',
	data() { return {
		id: null,
		loading: true,
		type: '',
		item: null
	}},
	created() {
		this.loadData()
	},
	beforeRouteUpdate(to, from) { console.log('beforeRouteUpdate') }, // not work ??
	watch: {
		'$route.name'(newVal, oldVal) {
			if(['Token', 'Wallet'].includes(newVal)) {
				this.loadData()
			}
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
