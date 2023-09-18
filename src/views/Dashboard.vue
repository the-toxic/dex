<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
		<div class="v-row align-center">
			<div class="v-col">
				<h1 class="text-h4 mt-2 mb-2">Dashboard</h1>
				<!-- <v-chip text="My Dashboard" size="large" />-->
			</div>
			<div class="v-col-auto">
				<v-select v-model="activeDash" :items="items" item-title="title" item-value="uuid" :loading="loading"
					density="compact" variant="outlined" hide-details class="va-middle d-inline-block" />
				<v-btn color="white" variant="outlined" @click="editDash" class="text-none mx-3">Edit</v-btn>
				<v-btn color="white" variant="outlined" @click="createDash" class="text-none" prepend-icon="mdi-monitor-dashboard">New Dashboard</v-btn>
			</div>
		</div>
		<div class="text-center" style="padding-top: 20%">
			<div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate /></div>
			<v-btn v-else color="primary" @click="addWidget" rounded class="text-none"
			 @mouseenter="soonText = 'Soon'" @mouseleave="soonText = 'Add Widget'"  prepend-icon="mdi-view-dashboard-edit-outline">{{ soonText }}</v-btn>
		</div>
  </v-container>
</template>

<script>
import { fetchDashboard } from "@/api";

export default {
  name: 'Dashboard',
  data: () => ({
    loading: false,
		activeDash: null,
    items: [],
		soonText: 'Add Widget'
  }),
	created() {
		this.loadData()
	},
	computed: {
		// parsedItems() { return !this.items ? [] : this.items.map(i => ({value: i.uuid, title: i.title})) }
	},
	methods: {
    async loadData () {
      this.loading = true
      const { data } = await fetchDashboard()
      this.loading = false
      if(data.success) {
        this.items = data.result
				this.activeDash = this.items[0]
      }
    },
		createDash() {

		},
		editDash() {

		},
		addWidget() {

		}
  },
}
</script>
