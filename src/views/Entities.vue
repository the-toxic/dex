<template>
	<v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
		<v-card class="mx-auto" max-width="800">
			<v-card-title class="d-flex justify-space-between align-center">
				<h1 class="text-body-1" style="letter-spacing: 3px !important;">PRIVATE ENTITIES</h1>
				<v-btn @click="editEntity()" class="text-none" color="primary" rounded density="comfortable" prepend-icon="mdi-account-box-outline">New Entity</v-btn>
			</v-card-title>

			<div v-if="loading" class="text-center py-5"><v-progress-circular :size="50" :width="4" color="white" indeterminate /></div>
			<div v-else-if="!items.length">Entities not existed.</div>
			<v-list v-else lines="two">
				<v-list-item
					v-for="item in items" :key="item.uuid" :title="item.label"
					:to="{name: 'Entity', params: {id: item.uuid}}"
				>
					<template v-slot:prepend>
						<v-avatar color="primary"><v-icon color="white">{{ item.icon }}</v-icon></v-avatar>
					</template>
					<template v-slot:subtitle>
						<div class="mt-1">
							Addresses: <v-chip v-for="wallet in item.wallets" :text="`${shortAddress(wallet.address)} ${wallet.label && '/ '+wallet.label}`" density="compact" class="mx-1 my-1"></v-chip>
						</div>
					</template>
					<template v-slot:append>
						<v-btn color="primary" @click.prevent="editEntity(item)" icon="mdi-square-edit-outline" variant="text" size="small"></v-btn>
						<v-btn color="error" @click.prevent="removeEntity(item)" icon="mdi-delete-outline" variant="text" size="small"></v-btn>
					</template>
				</v-list-item>
			</v-list>
		</v-card>

		<v-dialog v-model="dialog" max-width="700">
			<v-card :loading="dialogLoader">
				<v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
					<v-card-title class="mb-3 pt-7" style="font-size: 25px;">Entity Editor</v-card-title>
					<v-card-text>
						<v-text-field label="Entity Label*" v-model="form.label" class="mb-2" :rules="[v => !!v || 'Required field']" density="compact" />
						<v-divider />
						<div class="d-flex justify-space-between align-center mt-4 mb-4">
							<h4 class="fs16">Wallets</h4>
							<v-btn @click="addEmptyWallet" rounded variant="tonal" size="small" class="text-none" prepend-icon="mdi-wallet-plus-outline">Add Wallet</v-btn>
						</div>
						<div v-if="!form.wallets.length">Please click button "Add Wallet"</div>
						<div v-for="(wallet, idx) in form.wallets" :key="idx" class="v-row v-row--no-gutters justify-space-between align-center mb-6 mb-md-1">
							<div class="v-col-12 v-col-md-3">
								<v-text-field label="Label" v-model="wallet.label" placeholder="Custom name" density="compact" :rules="[v => !v || v.length < 64 || 'Max length 64 chars']" />
							</div>
							<div class="v-col-12 v-col-md-7">
								<v-text-field label="Address*" placeholder="0x..."  v-model="wallet.address" class="mx-md-3" density="compact" :rules="[v => !!v || 'Required field']" />
							</div>
							<div class="v-col-12 v-col-md">
								<v-btn variant="outlined" color="white" rounded class="mt-n5"><v-icon icon="mdi-ethereum" title="EVM Addresses" /></v-btn>
								<v-btn @click="removeWallet(wallet)" icon="mdi-close" color="error" variant="text" size="small" density="comfortable" class="mt-n5 ml-4" />
							</div>
						</div>
					</v-card-text>
					<v-card-actions>
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
import { mapActions } from "pinia";
import { shortAddress } from "@/helpers/mixins";
import { useMainStore } from "@/store/mainStore";
import { fetchPrivateEntities, removeEntity, saveEntity } from "@/api";

export default {
	name: 'Entities',
	data() { return {
		loading: true,
		items: [],
		dialog: false,
		dialogLoader: false,
		valid: true,
		form: {
			label: '',
			wallets: []
		},
		dialogDelete: false,
		deletedId: null
	}},
	created() {
		this.loadData()
	},
	methods: {
		shortAddress,
		...mapActions(useMainStore, {showAlert: 'showAlert'}),

		async loadData() {
			this.loading = true
			const { data } = await fetchPrivateEntities()
			this.loading = false

			if(data.success) {
				this.items = data.result
			}
		},

		async editEntity(entity = null) {
			this.dialog = true
			if(entity) {
				this.form.label = entity.label
				this.form.wallets = JSON.parse(JSON.stringify(entity.wallets))
			} else {
				this.resetForm()
				this.form.wallets = []
				this.addEmptyWallet()
			}
		},
		addEmptyWallet() {
			this.form.wallets.push({id: 'new', label: '', address: ''})
		},
		resetForm() {
			this.$nextTick(() => this.$refs.form.reset()) // resetValidation()
		},
		async removeEntity(entity) {
			this.deletedId = entity.uuid
			this.dialogDelete = true
		},
		async removeWallet(wallet) {
			this.form.wallets = this.form.wallets.filter(item => item !== wallet)
		},

		async onSubmit() {
			const { valid } = await this.$refs.form.validate()
			if(!valid) return false

			this.dialogLoader = true
			const { data } = await saveEntity(this.form)
			this.dialogLoader = false

			if(data.success) {
				this.dialog = false
				this.showAlert({msg: 'Successfully updated', color: 'success'})
			}
		},
		async onDeleteItem() {
			this.dialogLoader = true
			const { data } = await removeEntity(this.deletedId)
			this.dialogLoader = false
			this.dialogDelete = false
			this.deletedId = null

			if(data.success) {
				this.showAlert({msg: 'Successfully removed', color: 'success'})
			}
		}
	}
}
</script>
