<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="v-row align-center">
      <div class="v-col">
        <h1 class="text-h5 mt-2 mb-2">SEGMENTS</h1>
      </div>
      <div class="v-col-auto">
        <v-select label="Current Segment" v-model="currentSegmentId" :items="segmentsList" :loading="loading" :disabled="loading || !currentSegmentId" hide-no-data
          density="compact" variant="outlined" hide-details class="va-middle d-inline-block mr-3" />

        <v-btn color="white" variant="outlined" rounded size="small" @click="editItem(currentSegmentId)"
          :disabled="loading || !currentSegmentId" icon="mdi-pencil" class="text-none mr-3" title="Edit" />

        <v-btn variant="outlined" @click="editItem()" :disabled="loading" title="Add"
          rounded size="small" class="text-none mr-3" icon="mdi-plus" />

        <v-btn variant="outlined" @click="null" :disabled="loading" title="Alert"
          rounded size="small" class="text-none" icon="mdi-bell-outline" />
      </div>
    </div>

    <div v-if="loading || !segmentsList.length" class="d-flex h-100 align-center justify-center text-center mt-n24">
      <div v-if="loading"><v-progress-circular :size="50" :width="4" color="white" indeterminate /></div>
      <v-btn v-else-if="!segmentsList.length" color="text-grey-lighten-1" variant="outlined" @click="editItem()" :disabled="loading" class="text-none" prepend-icon="mdi-plus"
        >Add Segment</v-btn>
    </div>


    <template v-else>
      <div class="d-flex justify-space-between align-center flex-wrap mt-4 px-4 py-3 rounded-t bg-surface2" style="gap: 10px;">
        <Datepicker pickerName="datepickerPeriod" placeholder="Period" :initPeriod="filter.period" @update="onPeriodChange($event)" />
        <div style="width: 250px">
          <v-text-field v-model="filter.search" label="Search" placeholder="By Wallet" clearable @click:clear="filter.search = ''"
            density="compact" prepend-inner-icon="mdi-magnify" hide-details rounded variant="outlined" persistent-placeholder />
        </div>
      </div>

      <v-data-table-server
        v-model:items-per-page="per_page"
        v-model:sort-by="sortBy"
        v-model:page="page"
        :headers="headers"
        :items-length="totalItems"
        :items="items"
        :loading="loadingTable"
        class="elevation-1 fs14"
        @update:options="loadTable"
        :items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"
      >
        <template v-slot:item.from="{ item }">
          <v-btn :to="{name: 'Address', params: {id: item.from}}" rounded variant="text" density="compact" :active="false" class="text-none">{{ shortAddress(item.from) }}</v-btn>
          <v-btn icon="mdi-content-copy" variant="text" size="x-small" @click="$clipboard(item.from)" />
        </template>
        <template v-slot:item.to="{ item }">
          <v-btn :to="{name: 'Address', params: {id: item.to}}" rounded variant="text" density="compact" :active="false" class="text-none">{{ shortAddress(item.to) }}</v-btn>
          <v-btn icon="mdi-content-copy" variant="text" size="x-small" @click="$clipboard(item.to)" />
        </template>
        <template v-slot:item.amount="{ item }">{{ formatNumber(item.amount, true) }}</template>
        <template v-slot:item.token="{ item }">{{ item.token }}</template>
        <template v-slot:item.usd="{ item }">{{ toCurrency(item.usd) }}</template>
      </v-data-table-server>
    </template>


    <v-dialog v-model="dialog" max-width="550">
      <v-card :loading="dialogLoader">
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
          <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Segment Editor</v-card-title>
          <v-card-text>
            <v-text-field label="Name*" v-model="form.name" placeholder="Segment name"
              :rules="[v => !v || v.length < 64 || 'Max length 64 chars']" />

            <v-textarea label="Description"  v-model="form.description" rows="2" :rules="[v => !v || v.length <= 1024 || 'Max length is 1000 chars']" />
            <v-spacer />
<!--{{ form.address }}-->
            <v-autocomplete label="Address*" v-model="form.address" return-object  placeholder="Enter at least 3 chars to search" :hide-no-data="false"
              @update:search="onAddressSearch($event, 'address')" :items="addressesList" :loading="addressesLoading" no-filter />

            <v-autocomplete label="From*" v-model="form.from" return-object  placeholder="Enter at least 3 chars to search" :hide-no-data="false"
              @update:search="onAddressSearch($event, 'from')" :items="addressesList" :loading="addressesLoading" no-filter />

            <v-autocomplete label="To*" v-model="form.to" return-object  placeholder="Enter at least 3 chars to search" :hide-no-data="false"
              @update:search="onAddressSearch($event, 'to')" :items="addressesList" :loading="addressesLoading" no-filter />

<!--            <v-text-field label="From" v-model="form.from" placeholder="Filter from address" :loading="addressesLoading" persistent-placeholder />-->
<!--            <v-text-field label="To" v-model="form.to" placeholder="Filter to address" :loading="addressesLoading" persistent-placeholder />-->

            <div class="d-flex align-center" style="gap: 10px">
              <v-text-field label="Min Value in USD" type="number" v-model="form.value_usd_min" :rules="[v => !v || (!isNaN(v) && +v >= 0 && +v < 1e12) || 'Incorrect number']" />
              <v-text-field label="Max Value in USD" type="number" v-model="form.value_usd_max" :rules="[v => !v || (!isNaN(v) && +v >= 0 && +v < 1e12) || 'Incorrect number']" />
            </div>

            <v-select label="Network" v-model="form.network" :items="networksList"></v-select>

            <v-autocomplete label="Tokens" v-model="form.tokens" return-object multiple chips closable-chips placeholder="Type more 3 chars for search" no-filter
              @update:search="onTokensSearch" :items="tokensList" item-title="name" item-value="id" :loading="tokensLoading" counter :rules="[v => v.length <= 10 || 'Max allow 10 tokens']" />

            <!-- <div v-if="form.tokens.length" class="border-md border-s-xl pa-3 pb-1 rounded">
              <div v-for="item in form.tokens" class="d-flex align-center mb-2" style="gap: 10px">
                <div style="width: 180px">{{ item.name }}</div>
                <v-text-field label="Min Value" v-model="item.value_min" density="compact" hide-details="auto" />
                <v-text-field label="Max Value" v-model="item.value_max" density="compact" hide-details="auto" />
              </div>
            </div>-->

            <!-- <div class="mt-4 font-weight-bold text-body-1">Send alert to:</div>
            <v-switch label="Webhook" hide-details color="primary" class="d-inline-block mr-3" />
            <v-switch label="Slack" hide-details color="primary" class="d-inline-block mr-3" />
            <v-switch label="Telegram" hide-details color="primary" class="d-inline-block mr-3" />
            <v-switch label="Email" hide-details color="primary" class="d-inline-block" />-->

          </v-card-text>
          <v-card-actions>
            <v-btn v-if="form.id" variant="text" @click="showDeleteDialog('segment', form.id)" color="error">Delete</v-btn>
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
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { useDebounceFn } from "@vueuse/core";
import { mapActions, mapState } from "pinia";
import { shortAddress, toCurrency, formatNumber, chainTypesRegex } from "@/helpers/mixins";
import { useMainStore } from "@/store/mainStore";
import { fetchTXs, fetchSegments, getSegmentInfo, saveSegment, searchAddresses, searchTokens, removeSegment, fetchSearch } from "@/api";
import Datepicker from "@/components/Datepicker.vue";

export default {
  name: 'Segments',
  head: () => ({ title: 'Segments' }),
  components: { Datepicker, VDataTableServer },
  data() {return {
    chainTypesRegex,

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
      period: [
        null, // moment().subtract(7, 'days').startOf("day").toDate(),
        null, // moment().endOf("day").toDate()
      ],
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

    this.searchTXsDebouncedFn = useDebounceFn(async () => {
      await this.loadTable()
    }, 500)

    this.searchAddressesDebouncedFn = useDebounceFn(async (query, variant) => {
      await this.addressesSearch(query, variant)
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
    },
    'filter.search'(newVal) {
      this.searchTXsDebouncedFn()
    },
  },
  computed: {
    ...mapState(useMainStore, {networks: 'networks'}),

    segmentsList() {
      return !this.segments ? [] : this.segments.map(i => ({value: i.id, title: i.name}))
    },
    networksList() {
      const networks = [{value: '', title: 'All'}]
      this.networks.forEach(name => networks.push({value: name.toLowerCase(), title: name}))
      return networks
    }
  },
  methods: {
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
        from_dttm: this.filter.period[0] ? moment(this.filter.period[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        to_dttm: this.filter.period[1] ? moment(this.filter.period[1]).format("YYYY-MM-DD HH:mm:ss") : '',
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

    async onAddressSearch(query, variant) {
      if(query?.trim().length && query.trim().length < 3) return
      await this.searchAddressesDebouncedFn(query, variant)
    },
    async addressesSearch(query, variant) {
      if(!query?.trim().length) {
        this.addressesList = []
        return
      }
      this.dialogLoader = true
      // const { data } = await searchAddresses(query)
      const {data} = await fetchSearch(query, 'entities,labels')
      this.dialogLoader = false
      this.addressesList = []

      if(data.success) {
        Object.keys(data.result).forEach(category => {
          if(!data.result[category].length) return

          data.result[category].forEach(item => {
            this.addressesList.push({
              value: item.id,
              title: item.name,
              props: {subtitle: category}
            })
          })
        })
        if(!this.addressesList.length) {
          const validAddress = Object.values(chainTypesRegex).some(regex => regex.test(query))
          if(validAddress) this.addressesList.push({ value: query, title: query, props: {subtitle: 'address'} })
        }
      }
    },

    async onTokensSearch(query) {
      if(query.trim().length && query.trim().length < 3) return
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
    },

    onPeriodChange($event) {
      this.filter.period = $event;
      this.loadTable()
    }
  }
}
</script>
