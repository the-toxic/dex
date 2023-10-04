<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
		<div class="v-row align-center">
			<div class="v-col">
				<h1 class="text-h4 mt-2 mb-2">Dashboard</h1>
				<!-- <v-chip text="My Dashboard" size="large" />-->
			</div>
			<div class="v-col-auto">
				<v-select v-model="activeDashSelect" :items="parsedItems" :loading="loading" hide-no-data
					density="compact" variant="outlined" hide-details class="va-middle d-inline-block" />
				<v-btn color="white" variant="outlined" @click="editDashboard" :disabled="currentIsDefault" prepend-icon="mdi-pencil" class="text-none mx-3">Edit</v-btn>
				<v-btn color="text-grey-lighten-1" variant="outlined" @click="addDashboard" class="text-none" prepend-icon="mdi-plus">Dashboard</v-btn>
			</div>
		</div>
		<div class="text-center" style="padding-top: 100px">
			<div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate /></div>
			<v-btn v-else color="primary" @click="addWidget" rounded class="text-none"
			 @mouseenter="soonText = 'Soon'" @mouseleave="soonText = 'Add Widget'"  prepend-icon="mdi-view-dashboard-edit-outline">{{ soonText }}</v-btn>
		</div>

		<v-dialog v-model="dialog" max-width="400">
			<v-card :loading="dialogLoader">
				<v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
					<v-card-title class="mb-3 pt-7" style="font-size: 25px;">Dashboard Editor</v-card-title>
					<v-card-text>
						<v-text-field label="Name*" v-model="form.name" class="mb-2" :rules="[v => !!v || 'Required field', v => v.length < 32 || 'Max length 32 chars']" density="compact" />
					</v-card-text>
					<v-card-actions>
						<v-btn v-if="form.id" @click="removeDash" :disabled="dialogLoader" color="red" variant="text">DELETE</v-btn>
						<v-spacer></v-spacer>
						<v-btn variant="text" @click="dialog = false" color="disabled">Close</v-btn>
						<v-btn type="submit" variant="text" color="primary" :loading="dialogLoader" :disabled="dialogLoader">Save</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogDelete" max-width="500">
			<v-card rounded class="rounded-xl">
				<v-card-text class="text-center py-16 px-10">
					<p class="fs20 mb-6">Are you sure you want to delete?</p>
					<div class="d-flex justify-center align-center">
						<v-btn color="red" @click="onDeleteItem" :loading="dialogLoader" :disabled="dialogLoader" class="text-none mr-6">Delete</v-btn>
						<v-btn color="white" @click="dialogDelete = false" class="text-none">Cancel</v-btn>
					</div>
				</v-card-text>
			</v-card>
		</v-dialog>
  </v-container>
</template>

<script>
import { fetchDashboards, removeDashboard, saveDashboard } from "@/api";
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
  name: 'Dashboard',
  head: () => ({ title: 'Dashboard' }),
  data: () => ({
    loading: false,
		activeDashSelect: null,
    items: [],
		soonText: 'Add Widget',

		dialog: false,
		dialogLoader: false,
		valid: true,
		form: {
			id: null,
			name: null,
		},
		dialogDelete: false,
		// deletedId: null
  }),
	created() {
		this.loadData()
	},
	computed: {
		parsedItems() { return !this.items ? [] : this.items.map(i => ({value: +i.id, title: i.name})) },
    currentIsDefault() {
      if(!this.items.length) return false
      const { name: currentName } = this.items.find(i => +i.id === +this.activeDashSelect)
      return currentName === 'Default'
    }
	},
	methods: {
		...mapActions(useMainStore, ['showAlert']),
    async loadData (selectedIdAfterLoad = null) {
      this.loading = true
      const { data } = await fetchDashboards()
      this.loading = false

      if(data.success) {
        this.items = Object.keys(data.result).map(id => ({
					id: +id,
					name: data.result[id].name,
					widgets: data.result[id].widgets
				}))
				this.activeDashSelect = +selectedIdAfterLoad || +this.items[0]?.id
      }
    },
		addDashboard() {
			this.dialog = true
			this.resetForm()
		},
		async editDashboard() {
			this.dialog = true
			const { id, name } = this.items.find(i => +i.id === this.activeDashSelect)
			this.form.id = +id
			this.form.name = name
		},
		resetForm() {
			this.form.id = null
			this.$nextTick(() => this.$refs.form.reset()) // resetValidation()
		},
		async removeDash() {
			// this.deletedId = item.id
			this.dialogDelete = true
		},

		async onSubmit() {
			// const { valid } = await this.$refs.form.validate()
			if(!this.valid) return false

			this.dialogLoader = true
			const { data } = await saveDashboard(this.form)
			this.dialogLoader = false

			if(data.success) {
				this.dialog = false
				this.showAlert({msg: 'Successfully save', color: 'success'})
				await this.loadData(data.result?.id || this.activeDashSelect)
			}
		},
		async onDeleteItem() {
			this.dialogLoader = true
			const { data } = await removeDashboard(this.form.id)
			this.dialogLoader = false
			this.dialogDelete = false
			this.dialog = false
			// this.deletedId = null

			if(data.success) {
				this.showAlert({msg: 'Successfully removed', color: 'success'})
				await this.loadData()
			}
		},
		addWidget() {}
  },
}
</script>
