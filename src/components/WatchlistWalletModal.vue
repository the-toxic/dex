<template>
  <v-dialog v-model="dialog" max-width="500">
<!--		<template v-slot:activator="{ props }">-->
<!--			<v-btn v-bind="props" rounded class="text-none mb-2 mb-md-0" color="primary">Add Wallet</v-btn>-->
<!--		</template>-->
    <v-card :loading="loading">
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmit" class="px-4">
        <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Watchlist Wallet</v-card-title>
        <v-card-text>
          <v-text-field label="Address*" v-model="form.address" placeholder="Wallet address"
						persistent-placeholder class="mb-2" :rules="[v => !!v || 'Required field']"></v-text-field>
          <v-text-field label="Label*" v-model="form.label" placeholder="Custom name of wallet"
						persistent-placeholder class="mb-2" :rules="[v => !!v || 'Required field']"></v-text-field>
          <v-select label="Chain*" v-model="form.network" class="mb-2"
						:items="Object.keys(chains).map(key => ({value: chains[key].name.toLowerCase(), title: chains[key].name}))"></v-select>
          <v-textarea label="Note" v-model="form.note" placeholder="Custom note for self"
						persistent-placeholder :rules="[v => !v || v.length < 512  || 'Required field']" counter class="mb-2"></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false" color="disabled">Close</v-btn>
          <v-btn type="submit" variant="text" color="secondary" :loading="loading" :disabled="loading">Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";
import { passwordRules } from "@/helpers/mixins";
import { fetchWhitelistWalletItem, saveWatchlistWallet } from "@/api";

export default {
  name: "WatchlistWalletModal",
  props: {
		injectData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      valid: true,
      form: {
				label: '',
				address: '',
				network: 'bsc',
				note: '',
      },
    }
  },
	watch: {
		injectData(newVal, oldVal) {
			console.log('watch', newVal)
			if(newVal.id === 'new') { // click create
				this.dialog = true
				this.resetForm()
			} else if(!isNaN(newVal.id)) { // click edit
				this.dialog = true
				this.resetForm()
				this.loadData(newVal.id)
			}
		}
	},
  computed: {
		...mapState(useMainStore, {chains: 'chains'}),
    passwordRules() { return passwordRules},
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

		async loadData(id) {
			this.loading = true
			const {data} = await fetchWhitelistWalletItem(id)
			this.loading = false
			if(data.success) {
				this.form = {...this.form, ...data.result}
			}
		},
    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      this.loading = true
      const { data } = await saveWatchlistWallet(this.form)
			console.log(data)
      this.loading = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Successfully saved', color: 'success'})
      }
    },
		resetForm() {
			this.$nextTick(() => this.$refs.form.reset()) // resetValidation()
		}
  }
}
</script>
