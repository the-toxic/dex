<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="v-row align-center">
      <div class="v-col">
        <h1 class="text-h5 mt-2 mb-2">SEGMENTS</h1>
      </div>
      <div class="v-col-auto">
        <v-select v-if="segmentsList.length" label="Segment" v-model="currentSegmentId" :items="segmentsList" :loading="loading" :disabled="loading || !currentSegmentId" hide-no-data
          density="compact" variant="outlined" hide-details class="va-middle d-inline-block mr-3" />

        <v-btn v-if="segmentsList.length" color="white" variant="outlined" rounded size="small" @click="editItem(currentSegmentId)"
          :disabled="loading || !currentSegmentId" icon="mdi-pencil" class="text-none mr-3" title="Edit" />

        <v-btn variant="outlined" @click="editItem()" :disabled="loading" title="Add"
          rounded size="small" class="text-none mr-3" icon="mdi-plus" />

        <v-btn v-if="segmentsList.length" title="Alert" variant="outlined" @click="null" :disabled="loading || true"
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
				density="comfortable"
        @update:options="loadTable"
        :items-per-page-options="[20,50,100]"
      >
				<template v-slot:item.date="{ item }">{{ item.date }}</template>
        <template v-slot:item.sender="{ item }">
<!--          <v-btn :to="{name: 'Address', params: {id: item.sender}}" rounded variant="text" density="compact" :active="false" class="text-none">{{ shortAddress(item.sender) }}</v-btn>-->
					<LabelAddress link copy :to="{name: 'Address', params: {id: item.sender.address}}" :address="item.sender" target="_blank" />
        </template>
        <template v-slot:item.receiver="{ item }">
<!--          <v-btn :to="{name: 'Address', params: {id: item.receiver}}" rounded variant="text" density="compact" :active="false" class="text-none">{{ shortAddress(item.receiver) }}</v-btn>-->
					<LabelAddress link copy :to="{name: 'Address', params: {id: item.receiver.address}}" :address="item.receiver" target="_blank" />
        </template>
        <template v-slot:item.amount="{ item }">{{ formatNumber(item.amount, true) }}</template>
				<template v-slot:item.symbol="{ item }"><v-chip color="secondary" size="small">{{ item.symbol }}</v-chip></template>
      </v-data-table-server>
    </template>


    <v-dialog v-model="dialog" max-width="550">
      <v-card :loading="dialogLoader">
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
          <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Segment Editor</v-card-title>
          <v-card-text>
            <v-text-field label="Name*" v-model="form.name" placeholder="Segment name"
              :rules="[v => !!v && v.length >= 4 && v.length <= 50 || 'Required, 4-50 chars']" />

            <v-textarea label="Description"  v-model="form.description" rows="2" :rules="[v => !v || v.length <= 1024 || 'Max length is 1000 chars']" />
            <v-spacer />
<!--{{ form.main_address }}-->
            <v-autocomplete label="Address*" v-model="form.main_address" return-object  placeholder="Enter at least 3 chars to search" :hide-no-data="false"
              @update:search="onAddressSearch($event, 'address')" :items="addressesList" :loading="addressesLoading" :rules="[v => !!v || 'Required field']" />

            <v-autocomplete label="From address" v-model="form.from_address" return-object  placeholder="Enter at least 3 chars to search" :hide-no-data="false"
              @update:search="onAddressSearch($event, 'from')" :items="addressesList" :loading="addressesLoading" clearable />

            <v-autocomplete label="To address" v-model="form.to_address" return-object  placeholder="Enter at least 3 chars to search" :hide-no-data="false"
              @update:search="onAddressSearch($event, 'to')" :items="addressesList" :loading="addressesLoading" clearable />

            <div class="d-flex align-center" style="gap: 10px">
              <v-text-field label="Min Value" type="number" v-model="form.min_value" :rules="[v => !v || (!isNaN(v) && +v >= 0 && +v < 1e12) || 'Incorrect number']" />
              <v-text-field label="Max Value" type="number" v-model="form.max_value" :rules="[v => !v || (!isNaN(v) && +v >= 0 && +v < 1e12) || 'Incorrect number']" />
            </div>

            <v-select label="Network" v-model="form.chain_id" :items="networksList" :disabled="!!form.tokens.length"></v-select>

            <v-autocomplete label="Tokens" v-model="form.tokens" return-object placeholder="Type more 3 chars for search"
              @update:search="onTokensSearch" :items="tokensList" :loading="tokensLoading" counter multiple chips closable-chips :rules="[v => v.length <= 10 || 'Max allow 10 tokens']" />

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
					<v-card-actions class="px-4 pt-0 pb-4">
						<v-btn v-if="form.id" variant="text" @click="showDeleteDialog('segment', form.id)" color="error" class="text-none">Delete</v-btn>
						<v-spacer></v-spacer>
						<v-btn variant="text" @click="dialog = false" color="disabled" class="text-none">Close</v-btn>
						<v-btn type="submit" variant="outlined" color="secondary" class="text-none" :loading="dialogLoader" :disabled="dialogLoader">Save</v-btn>
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
import { useDebounceFn } from "@vueuse/core";
import { mapActions, mapState } from "pinia";
import { shortAddress, toCurrency, formatNumber, chainTypesRegex } from "@/helpers/mixins";
import { useMainStore } from "@/store/mainStore";
import { fetchSegmentTXs, fetchSegments, getSegmentInfo, saveSegment, removeSegment, fetchSearch } from "@/api";
import Datepicker from "@/components/Datepicker.vue";
import LabelAddress from "@/components/UI/LabelAddress.vue";

export default {
  name: 'Segments',
  head: () => ({ title: 'Segments' }),
  components: { LabelAddress, Datepicker },
  data() {return {
    chainTypesRegex,

    loading: false,
    currentSegmentId: null,
    segments: [],

    loadingTable: false,
    page: 1,
    per_page: 20,
    sortBy: [{key: 'date', order: 'desc'}],
    headers: [
      { title: 'Date', key: 'date', align: 'center', sortable: false },
      { title: 'From', key: 'sender', align: 'center', sortable: false },
      { title: 'To', key: 'receiver', align: 'center', sortable: false },
      { title: 'Amount ', key: 'amount', align: 'center', sortable: false },
      { title: 'Token ', key: 'symbol', align: 'center', sortable: false },
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
      main_address: '',
      from_address: '',
      to_address: '',
      chain_id: '',
      min_value: 0,
      max_value: 1,
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
    const { id } = this.$route.query
    if(id && !isNaN(id) && +id > 0 && +id < 1000000) {
      this.loadSegments(+id).then()
    } else {
      this.loadSegments().then()
    }

    this.searchTXsDebouncedFn = useDebounceFn(async () => {
      await this.loadTable()
    }, 500)

    this.searchAddressesDebouncedFn = useDebounceFn(async (query, variant) => {
      await this.addressesSearch(query, variant)
    }, 800)

    this.searchTokensDebouncedFn = useDebounceFn(async (query) => {
      await this.tokensSearch(query)
    }, 800)
  },
  watch: {
    currentSegmentId(newVal, oldVal) {
      console.log('currentSegmentId: ', oldVal, '->', newVal)
      this.$router.push({...this.$route, query: {id: newVal}})
      if(newVal) this.loadTable() // after delete last segment newvVal = null
    },
    'filter.search'(newVal) {
      this.searchTXsDebouncedFn()
    },
    'form.tokens'(newVal, oldVal) {
      if(newVal.length && !!newVal[0].chain_id && this.form.chain_id !== newVal[0].chain_id) {
        this.form.chain_id = newVal[0].chain_id
      }
      if(this.tokensList.some(i => i.chain_id !== this.form.chain_id)) {
        this.tokensList = this.tokensList.filter(i => i.chain_id === this.form.chain_id)
      }
    },
  },
  computed: {
    ...mapState(useMainStore, {chains: 'chains'}),

    segmentsList() {
      return !this.segments ? [] : this.segments.map(i => ({value: i.id, title: i.name}))
    },
    networksList() {
      const needChains = ['Ethereum', 'BSC']
      const chains = [{value: 0, title: 'All'}]
      Object.values(this.chains).forEach(item => {
        if(needChains.includes(item.name))
          chains.push({value: item.id, title: item.name})
      })
      return chains
    },
  },
  methods: {
    toCurrency, formatNumber, shortAddress,
    ...mapActions(useMainStore, { showAlert: 'showAlert' }),

    async loadSegments (selectIDAfterLoad = null) {
      this.loading = true
      const { data } = await fetchSegments()
      this.loading = false

      if(data.success) {
        this.segments = data.result.items
        const existId = selectIDAfterLoad && data.result.items.some(item => item.id === selectIDAfterLoad)
        this.currentSegmentId = (existId && selectIDAfterLoad) || data.result.items[0]?.id || null
				// if(this.currentSegmentId) await this.loadTable() // call in watch change currentSegmentId
      }
    },

    async loadTable () {
			if(this.loadingTable) return // deny double request
      this.loadingTable = true
      const { data } = await fetchSegmentTXs({
        id: this.currentSegmentId,
        search: this.filter.search.trim(),
        from_dttm: this.filter.period[0] ? moment(this.filter.period[0]).format("YYYY-MM-DD HH:mm:ss") : '',
        to_dttm: this.filter.period[1] ? moment(this.filter.period[1]).format("YYYY-MM-DD HH:mm:ss") : '',
        page: this.page,
        per_page: this.per_page,
        sortBy: this.sortBy,
      })
      this.loadingTable = false
      if(data.success) {
        this.items = data.result.items.filter(item => !!item.sender && !!item.receiver).map(item => {
					item.date = new Date(item.date * 1000).toISOString().slice(0, 19).replace('T', ' ')
					return item
				})
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
        this.form.id = segmentId
        this.form.name = data.result.name
        this.form.description = data.result.description
        this.form.main_address = {
          value: data.result.main_address.value,
          title: data.result.main_address.name || data.result.main_address.value,
          props: { subtitle: data.result.main_address.type }
        }
        this.form.from_address = !data.result.from_address ? null : {
          value: data.result.from_address.value,
          title: data.result.from_address.name || data.result.from_address.value,
          props: { subtitle: data.result.from_address.type }
        }
        this.form.to_address = !data.result.to_address ? null : {
          value: data.result.to_address.value,
          title: data.result.to_address.name || data.result.to_address.value,
          props: { subtitle: data.result.to_address.type }
        }
        this.form.chain_id = data.result.chain_id
        this.form.min_value = data.result.min_value
        this.form.max_value = data.result.max_value
        this.form.tokens = data.result.tokens.map(item => ({
          value: item.id,
          title: item.symbol || item.name,
          props: {subtitle: `${item.name} (${shortAddress(item.address)})`}
        }))
      } else {
        this.form.id = null
        this.form.chain_id = 0 // All
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
      const {data} = await fetchSearch(query, 'entities,labels')
      if(!data.canceled)
        this.dialogLoader = false

      if(data.success) {
        this.addressesList = []
        Object.keys(data.result).forEach(category => {
          if(!data.result[category].length) return

          data.result[category].forEach(item => {
            this.addressesList.push({
              value: item.id,
              title: item.name,
              props: {subtitle: category === 'entities' ? 'entity' : (category === 'labels' ? 'label' : (category === 'wallets' ? 'address' : '?'))}
            })
          })
        })
        if(!this.addressesList.length) {
          const validAddress = this.checkWalletOnChainTypes(query)
          if(validAddress) this.addressesList.push({ value: query, title: query, props: {subtitle: 'address'} })
        }
      }
    },

    checkWalletOnChainTypes(query) {
      const chainTypes = [ // BUG on import from mixins
        /^0x[0-9a-fA-F]{40}$/g,
        /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/ig,
        /^T[A-Za-z1-9]{33}$/g,
        /^[1-9A-HJ-NP-Za-km-z]{32,44}$/g,
        /X[1-9A-HJ-NP-Za-km-z]{33}$/g,
        /^([LM3][a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[a-z0-9]{39,59})$/,
        /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/,
      ]
      return chainTypes.some( regex => regex.test(query) )
    },

    async onTokensSearch(query) {
      if(query.trim().length && query.trim().length < 3) return
      await this.searchTokensDebouncedFn(query)
    },
    async tokensSearch(query) {
      this.tokensLoading = true
      const { data } = await fetchSearch(query, 'tokens', this.form.chain_id || null)
      if(!data.canceled)
        this.tokensLoading = false

      if(data.success) {
        this.tokensList = []
        data.result['tokens'].forEach(item => {
          this.tokensList.push({
            value: item.id,
            title: item.symbol || item.name,
            props: {subtitle: `${item.name} (${shortAddress(item.address)}) [${this.chains[item.chain_id]['name']}]`},
            chain_id: item.chain_id
          })
        })
      }
    },

    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      const form = { ...this.form }
      form.main_address = { type: form.main_address.props.subtitle, value: form.main_address.value } // required
      form.from_address = !form.from_address ? null : { type: form.from_address.props.subtitle, value: form.from_address.value }
      form.to_address = !form.to_address ? null : { type: form.to_address.props.subtitle, value: form.to_address.value }
      form.tokens = form.tokens.map(i => i.value)
      form.min_value = +form.min_value ? +form.min_value : null
      form.max_value = +form.max_value ? +form.max_value : null

      this.dialogLoader = true
      const { data } = await saveSegment(form)
      this.dialogLoader = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Successfully updated', color: 'success'})
        await this.loadSegments(data.result.id || this.currentSegmentId) // get new id after create
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
