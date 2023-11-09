<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="v-row align-center">
      <div class="v-col">
        <h1 class="text-h4 mt-2 mb-2">Segments</h1>
      </div>
      <div class="v-col-auto">
        <v-select label="Current Segment" v-model="currentSegmentId" :items="segmentsList" :loading="loading" :disabled="loading || !currentSegmentId" hide-no-data
          density="compact" variant="outlined" hide-details class="va-middle d-inline-block" />

        <v-btn text="Edit" color="white" variant="outlined" @click="editItem(currentSegmentId)"
          :disabled="loading || !currentSegmentId" prepend-icon="mdi-pencil" class="text-none mx-3" />

        <v-btn color="text-grey-lighten-1" variant="outlined" @click="editItem()" :disabled="loading" class="text-none" prepend-icon="mdi-plus"
          >Add Segment</v-btn>
      </div>
    </div>

    <div v-if="loading || !segmentsList.length" class="d-flex h-100 align-center justify-center text-center mt-n24">
      <div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate /></div>
      <v-btn v-else-if="!segmentsList.length" color="text-grey-lighten-1" variant="outlined" @click="editItem()" :disabled="loading" class="text-none" prepend-icon="mdi-plus"
        >Add Segment</v-btn>
    </div>

    <v-data-table-server v-else
      v-model:items-per-page="per_page"
      v-model:sort-by="sortBy"
      v-model:page="page"
      :headers="headers"
      :items-length="totalItems"
      :items="items"
      :loading="loadingTable"
      class="elevation-1 mt-6 fs14"
      @update:options="loadTable"
      :items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"
    >
      <template v-slot:item.from="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="tonal" density="compact" :active="false" class="text-none">{{ shortAddress(item.from) }}</v-btn></template>
      <template v-slot:item.to="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="tonal" density="compact" :active="false" class="text-none">{{ shortAddress(item.to) }}</v-btn></template>
      <template v-slot:item.amount="{ item }">{{ formatBigNumber(item.amount) }}</template>
      <template v-slot:item.token="{ item }">{{ item.token }}</template>
      <template v-slot:item.usd="{ item }">{{ toCurrency(item.usd) }}</template>
    </v-data-table-server>


    <v-dialog v-model="dialog" max-width="500">
      <v-card :loading="dialogLoader">
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
          <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Segment Editor</v-card-title>
          <v-card-text>
            <v-text-field label="Name*" v-model="form.name" placeholder="Segment name"
              :rules="[v => !v || v.length < 64 || 'Max length 64 chars']" />

            <v-textarea label="Description"  v-model="form.description" rows="2" :rules="[v => !v || v.length <= 1024 || 'Max length is 1000 chars']" />
            <v-spacer />

            <v-autocomplete label="Address*" v-model="form.address" return-object placeholder="Type more 3 chars for search"
              @update:search="onAddressSearch" :items="addressesList" :loading="addressesLoading" clearable no-filter></v-autocomplete>

            <v-text-field label="From" v-model="form.from" placeholder="Filter from address" persistent-placeholder />
            <v-text-field label="To" v-model="form.to" placeholder="Filter to address" persistent-placeholder />

            <div class="d-flex align-center" style="gap: 10px">
              <v-text-field label="Min Value in USD" v-model="form.value_usd_min" placeholder="" />
              <v-text-field label="Max Value in USD" v-model="form.value_usd_max" placeholder="" />
            </div>

            <v-select label="Network" v-model="form.network" :items="networksList"></v-select>

            <v-autocomplete label="Tokens*" v-model="form.tokens" return-object multiple chips closable-chips placeholder="Type more 3 chars for search" no-filter
              @update:search="onTokensSearch" :items="tokensList" item-title="name" item-value="id" :loading="tokensLoading" />

            <div v-if="form.tokens.length" class="border-md border-s-xl pa-3 pb-1 rounded">
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
            <v-btn variant="text" @click="showDeleteDialog('segment', form.id)" color="error">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false" color="disabled">Close</v-btn>
            <v-btn type="submit" variant="text" color="primary" :loading="dialogLoader" :disabled="dialogLoader">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-text class="text-center py-16 px-10">
          <p class="text-h5 mb-6">This row will be removed.<br>Are your sure?</p>
          <div class="d-flex justify-center align-center">
            <v-btn color="red" @click="deleteItem" :loading="deleteLoading" :disabled="deleteLoading" class="mr-6">Delete</v-btn>
            <v-btn color="white" @click="deleteDialog = false" class="text-none">Cancel</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { useDebounceFn } from "@vueuse/core";
import { mapActions } from "pinia";
import { shortAddress, toCurrency, formatNumber, formatBigNumber } from "@/helpers/mixins";
import { useMainStore } from "@/store/mainStore";
import { fetchTXs, fetchSegments, getSegmentInfo, saveSegment, searchAddresses, searchTokens, removeSegment } from "@/api";

export default {
  name: 'Segments',
  head: () => ({ title: 'Segments' }),
  components: { VDataTableServer },
  data() {return {
    loading: false,
    currentSegmentId: null,
    segments: [],

    loadingTable: false,
    page: 1,
    per_page: 20,
    sortBy: [{key: 'id', order: 'desc'}],
    headers: [
      { title: 'Date', key: 'date', align: 'center', sortable: false },
      { title: 'From', key: 'from', align: 'center', sortable: false },
      { title: 'To', key: 'to', align: 'center', sortable: false },
      { title: 'Amount', key: 'amount', align: 'center', sortable: false },
      { title: 'Token', key: 'token', align: 'center', sortable: false },
      { title: 'USD', key: 'usd', align: 'center', sortable: false },
    ],
    items: [],
    totalItems: 0,
    filter: {
      search: '',
    },

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

    deleteDialog: false,
    deleteLoading: false,
    deletedItem: {
      type: null,
      id: null
    },
  }},
  async created() {
    this.loadSegments().then()

    this.searchAddressesDebouncedFn = useDebounceFn(async (query) => {
      await this.addressesSearch(query)
    }, 500)

    this.searchTokensDebouncedFn = useDebounceFn(async (query) => {
      await this.tokensSearch(query)
    }, 500)
  },
  watch: {
    currentSegmentId(newVal, oldVal) {
      if(!oldVal) return
      console.log(oldVal, '->', newVal)
      this.loadTable(this.currentSegmentId)
    }
  },
  computed: {
    segmentsList() {
      return !this.segments ? [] : this.segments.map(i => ({value: i.id, title: i.name}))
    },
    networksList() {
      return [{value: '', title: 'All'}, {value: 'ethereum', title: 'Ethereum'}, {value: 'bsc', title: 'BSC'}, {value: 'solana', title: 'Solana'}, ]
    }
  },
  methods: {
    formatBigNumber,
    toCurrency, formatNumber, shortAddress,
    ...mapActions(useMainStore, { showAlert: 'showAlert' }),

    async loadSegments () {
      this.loading = true
      const { data } = await fetchSegments()
      this.loading = false

      if(data.success) {
        this.segments = data.result
        this.currentSegmentId = data.result[0]?.id
        await this.loadTable(this.currentSegmentId)
      }
    },

    async loadTable (segmentId) {
      this.loadingTable = true
      const { data } = await fetchTXs({
        segment_id: segmentId,
        search: this.filter.search.trim(),
        page: this.page,
        per_page: this.per_page,
        sortBy: this.sortBy,
      })
      this.loadingTable = false
      if(data.success) {
        this.items = data.result.items
        this.totalItems = data.result.total
      }
    },

    async editItem(segmentId = null) {
      this.dialog = true
      this.tokensList = []
      this.addressesList = []
      await this.$nextTick(() => this.$refs.form.reset()) // resetValidation()

      if(segmentId) {
        this.dialogLoader = true
        const { data } = await getSegmentInfo(segmentId)
        this.dialogLoader = false
        if(!data.success) {
          this.showAlert('Error on load segment')
          return
        }
        this.form.id = data.result.id
        this.form.name = data.result.name
        this.form.description = data.result.description
        this.form.address = data.result.address
        this.form.from = data.result.from
        this.form.to = data.result.to
        this.form.network = data.result.network
        this.form.value_usd_min = data.result.value_usd_min
        this.form.value_usd_max = data.result.value_usd_max
        this.form.tokens = data.result.tokens
      } else {
        this.form.id = null
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
      const { data } = await saveSegment(this.form)
      this.dialogLoader = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Successfully updated', color: 'success'})
        await this.loadTable()
      }
    },

    async showDeleteDialog (type, id) {
      this.deleteDialog = true
      this.deletedItem.type = type
      this.deletedItem.id = id
    },
    async deleteItem () {
      this.deleteLoading = true
      const { data } = await removeSegment(this.deletedItem.id)
      this.deleteLoading = false
      this.deleteDialog = false
      this.dialog = false

      if (data.success) {
        this.showAlert({msg: 'Successfully removed', color: 'success'})
        await this.loadSegments()
      }
    }
  }
}
</script>
