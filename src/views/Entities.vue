<template>
	<v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
<!--		<div class="d-flex align-center">-->
<!--			<h1 class="text-h4 mt-2 mb-2">PRIVATE ENTITIES</h1>-->
<!--		</div>-->
		<div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" /></div>
		<template v-else>
			<v-card class="mx-auto" max-width="800">
				<v-card-title class="d-flex justify-space-between align-center">
					<h1 class="text-body-1" style="letter-spacing: 3px !important;">PRIVATE ENTITIES</h1>
					<v-btn @click="dialog = true" class="text-none" color="primary" rounded density="comfortable" prepend-icon="mdi-wallet-plus-outline">New Entity</v-btn>
				</v-card-title>

				<v-list lines="two">
					<v-list-item
						v-for="item in items" :key="item.uuid"
						:title="item.label"
					  :to="{name: 'Entity', params: {id: item.uuid}}"
					>
						<template v-slot:prepend>
							<v-avatar color="primary"><v-icon color="white">{{ item.icon }}</v-icon></v-avatar>
						</template>
						<template v-slot:subtitle>
							<div class="mt-1">
								Addresses: <v-chip v-for="wallet in item.wallets" :text="shortAddress(wallet)" density="compact" class="mx-1 my-1"></v-chip>
							</div>
						</template>
						<template v-slot:append>
							<v-btn color="primary" @click="editEntity(item, $event)" icon="mdi-square-edit-outline" variant="text" size="small"></v-btn>
							<v-btn color="error" @click="removeEntity(item, $event)" icon="mdi-delete-outline" variant="text" size="small"></v-btn>
						</template>
					</v-list-item>
				</v-list>
			</v-card>
		</template>

		<v-dialog v-model="dialog" activator="parent" max-width="400px">
			<v-card :loading="loadingDialog">
				<v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
					<v-card-title class="mb-3 pt-7" style="font-size: 25px;">Entity Editor</v-card-title>

					<v-card-text>
						<v-text-field label="Entity Label" v-model="form.label" class="mb-2" :rules="[v => !!v || 'Required field']" />
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn variant="text" @click="dialog = false" color="disabled">Close</v-btn>
						<v-btn type="submit" variant="text" color="primary" :loading="loadingDialog" :disabled="loadingDialog">Save</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { mapActions } from "pinia";
import { shortAddress } from "@/helpers/mixins";
import { useMainStore } from "@/store/mainStore";
import { saveEntity } from "@/api";

export default {
	name: 'Entities',
	data() { return {
		loading: false,
		items: [
			{label: 'My Entity 1', uuid: '1231231231-1231231231-1231231231-123111', wallets: ['0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE', '0xDEa42D23ed4C1483bC54F25Ba869f573385606da'], icon: 'mdi-wallet'},
			{label: 'My Entity 2', uuid: '1231231231-1231231231-1231231231-123111', wallets: ['0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE', '0xDEa42D23ed4C1483bC54F25Ba869f573385606da'], icon: 'mdi-wallet'},
		],
		dialog: false,
		loadingDialog: false,
		valid: true,
		form: {
			label: ''
		},
	}},
	// watch: {
	// 	dialog(newVal) {
	// 		console.log('111', newVal)
	// 	}
	// },
	methods: {
		shortAddress,
		...mapActions(useMainStore, {showAlert: 'showAlert'}),

		async editEntity(entity, $event) {
			// console.log(arguments)
			$event.preventDefault()
			$event.stopPropagation()
			// this.dialog = true
		},
		async removeEntity(entity, $event) {
			$event.preventDefault()
			$event.stopPropagation()
		},
		async onSubmit() {
			const { valid } = await this.$refs.form.validate()
			if(!valid) return false

			this.loadingDialog = true
			const { data } = await saveEntity(this.form)
			this.loadingDialog = false

			if(data.success) {
				this.dialog = false
				this.showAlert({msg: 'Successfully updated', color: 'success'})
			}
		}
	}
}
</script>
