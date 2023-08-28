<template>
  <v-dialog v-model="dialog" max-width="400px">
		<template v-slot:activator="{ props }">
			<v-btn v-bind="props" rounded class="text-none mb-2 mb-md-0" color="primary">Add Wallet</v-btn>
		</template>
    <v-card :loading="loading">
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmit" class="px-4">
        <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Watchlist Wallet</v-card-title>
        <v-card-text>
          <v-text-field label="Address*" v-model="form.address" placeholder="Wallet address"
						persistent-placeholder class="mb-2" :rules="[v => !!v || 'Required field']"></v-text-field>
          <v-text-field label="Label*" v-model="form.label" placeholder="Custom name of wallet"
						persistent-placeholder class="mb-2" :rules="[v => !!v || 'Required field']"></v-text-field>
          <v-select label="Network*" v-model="form.network" class="mb-2"
						:items="[{value: 'bsc', title: 'BSC'}, {value: 'ether', title: 'Ethereum'}]"></v-select>
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
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";
import { passwordRules } from "@/helpers/mixins";
import { saveWatchlistWallet } from "@/api";

export default {
  name: "WatchlistWalletModal",
  props: {
    disabled: {
      type: Boolean,
      default: false
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
  computed: {
    passwordRules() { return passwordRules},
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

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
    }
  }
}
</script>
