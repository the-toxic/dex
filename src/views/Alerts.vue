<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h5 mt-2 mb-2">ALERTS</h1>
    </div>

    <v-btn text="New Alert" variant="tonal" prepend-icon="mdi-plus" color="success" rounded class="text-none" @click="editItem()" />

    <v-dialog v-model="dialog" max-width="500">
      <v-card :loading="dialogLoader">
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
          <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Alert Editor</v-card-title>
          <v-card-text>
            <v-text-field label="Name*" v-model="form.name" placeholder="Alert name"
              :rules="[v => !v || v.length < 64 || 'Max length 64 chars']" />

            <v-textarea label="Description"  v-model="form.description" rows="2" :rules="[v => !v || v.length <= 1024 || 'Max length is 1000 chars']" />
            <v-spacer />

            <v-autocomplete label="Address*" v-model="form.address" return-object placeholder="Type more 3 chars for search"
              @update:search="onAddressSearch" :items="addressesList" :loading="addressesLoading" clearable no-filter></v-autocomplete>

            <v-text-field label="From" v-model="form.from" placeholder="Filtered From Address" />
            <v-text-field label="To" v-model="form.to" placeholder="Filtered To Address" />

            <div class="d-flex align-center" style="gap: 10px">
              <v-text-field label="Min Value in USD" v-model="form.value_usd_min" placeholder="" />
              <v-text-field label="Max Value in USD" v-model="form.value_usd_max" placeholder="" />
            </div>

            <v-select label="Network" v-model="form.network" :items="networksList"></v-select>

            <v-autocomplete label="Tokens*" v-model="form.tokens" return-object multiple chips closable-chips placeholder="Type more 3 chars for search" no-filter
              @update:search="onTokensSearch" :items="tokensList" item-title="name" item-value="id" :loading="tokensLoading" />

            <div v-if="form.tokens.length" class="border-md border-s-xl pa-4 rounded">
              <div v-for="item in form.tokens" class="d-flex align-center mb-2" style="gap: 10px">
                <div style="width: 180px">{{ item.name }}</div>
                <v-text-field label="Min Value" v-model="item.value_min" density="compact" hide-details="auto" />
                <v-text-field label="Max Value" v-model="item.value_max" density="compact" hide-details="auto" />
              </div>
            </div>

            <div class="mt-4 font-weight-bold text-body-1">Send alert to:</div>
            <v-switch label="Webhook" hide-details color="primary" class="d-inline-block mr-3" />
            <v-switch label="Slack" hide-details color="primary" class="d-inline-block mr-3" />
            <v-switch label="Telegram" hide-details color="primary" class="d-inline-block mr-3" />
            <v-switch label="Email" hide-details color="primary" class="d-inline-block" />

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false" color="disabled">Close</v-btn>
            <v-btn type="submit" variant="text" color="primary" :loading="dialogLoader" :disabled="dialogLoader">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useDebounceFn } from "@vueuse/core";
import { mapActions } from "pinia";
import { shortAddress } from "@/helpers/mixins";
import { useMainStore } from "@/store/mainStore";
import { saveAlert, searchAddresses, searchTokens } from "@/api";

export default {
  name: 'Alerts',
  head: () => ({ title: 'Alerts' }),
  data() {return {
    loading: false,

    dialog: false,
    dialogLoader: false,
    valid: true,
    form: {
      id: null,
      name: '',
      description: '',
      address: '',
      from: '',
      to: '',
      network: '',
      value_usd_min: 0,
      value_usd_max: 1,
      tokens: []
    },
    addressesLoading: false,
    addressesList: [],

    tokensLoading: false,
    tokensList: [],
  }},
  async created() {
    this.searchAddressesDebouncedFn = useDebounceFn(async (query) => {
      await this.addressesSearch(query)
    }, 500)

    this.searchTokensDebouncedFn = useDebounceFn(async (query) => {
      await this.tokensSearch(query)
    }, 500)
  },
  computed: {
    networksList() {
      return [{value: '', title: 'All'}, {value: 'ethereum', title: 'Ethereum'}, {value: 'bsc', title: 'BSC'}, {value: 'solana', title: 'Solana'}, ]
    }
  },
  methods: {
    shortAddress,
    ...mapActions(useMainStore, { showAlert: 'showAlert' }),

    async editItem(item = null) {
      this.dialog = true
      this.tokensList = []
      this.addressesList = []

      if(item) {
        this.form.id = item.id
        this.form.name = item.name
        this.form.description = item.description
        this.form.address = item.address
        this.form.from = item.from
        this.form.to = item.to
        this.form.network = item.network
        this.form.value_usd_min = item.value_usd_min
        this.form.value_usd_max = item.value_usd_max
        this.form.tokens = item.tokens
      } else {
        await this.$nextTick(() => this.$refs.form.reset()) // resetValidation()
        this.form.id = null
        this.form.network = ''
      }
    },

    async onAddressSearch(query) {
      if(query.trim().length && query.trim().length <= 2) return
      await this.searchAddressesDebouncedFn(query)
    },
    async addressesSearch(query) {
      this.addressesLoading = true
      const { data } = await searchAddresses(query)
      this.addressesLoading = false

      if(data.success) {
        this.addressesList = data.result.map(i => ({ value: i.id, title: i.name, }))
      }
    },

    async onTokensSearch(query) {
      if(query.trim().length && query.trim().length <= 2) return
      await this.searchTokensDebouncedFn(query)
    },
    async tokensSearch(query) {
      this.tokensLoading = true
      const { data } = await searchTokens(query)
      this.tokensLoading = false

      if(data.success) {
        this.tokensList = data.result.map(i => ({ ...i, value_min: '', value_max: '' }))
      }
    },

    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      this.dialogLoader = true
      const { data } = await saveAlert(this.form)
      this.dialogLoader = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Successfully updated', color: 'success'})
        await this.loadItems()
      }
    },
  }
}
</script>
