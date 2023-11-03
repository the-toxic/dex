<template>

  <div class="d-flex justify-space-between align-center flex-wrap px-4 py-2 border-b" style="background: #141d26">
    <v-btn @click="editItem" variant="tonal" prepend-icon="mdi-plus" color="success" rounded class="text-none" >Add Label</v-btn>
    <v-spacer />
    <v-switch label="Only EVM" v-model="filter.network" true-value="evm" false-value="" hide-details color="primary" class="flex-grow-0" />
    <div style="width: 280px;">
      <v-text-field v-model="filter.search" label="Search" placeholder="Labels, wallets, entities, e.g." rounded variant="outlined"
        persistent-placeholder density="compact" prepend-inner-icon="mdi-magnify" hide-details  clearable @click:clear="filter.search = ''" class="ml-4"/>
    </div>
  </div>

<!--  <v-text-field v-model="filter.search" label="Search..." prepend-inner-icon="mdi-magnify" hide-details clearable @click:clear="filter.search = ''" density="compact" />-->

  <v-data-table-server
    v-model:page="page"
    v-model:items-per-page="per_page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items-length="totalItems"
    :items="items"
    :loading="loading"
    class="elevation-1 fs14"
    @update:options="loadItems"
  >
    <template v-slot:item.wallet="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="text" :active="false" class="text-none">{{ shortAddress(item.wallet) }}</v-btn></template>
    <template v-slot:item.entity="{ item }">{{ item.entity ? item.entity : '&mdash;' }}</template>
    <template v-slot:item.network="{ item }"><v-chip color="secondary" class="text-uppercase" size="small">{{ item.network }}</v-chip></template>
    <template v-slot:item.action="{ item }">
      <v-btn @click="editItem(item)" icon="mdi-eye-outline" variant="text" size="small" color="secondary"></v-btn>
      <v-btn @click="showDeleteDialog('tag', item.id)" icon="mdi-trash-can-outline" variant="text" size="small" color="error"></v-btn>
    </template>
  </v-data-table-server>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :loading="dialogLoader">
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
        <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Label Editor</v-card-title>
        <v-card-text>
          <v-text-field label="Label*" v-model="form.label" placeholder="Custom name"
            :rules="[v => !v || v.length < 64 || 'Max length 64 chars']" />

          <v-select label="Network*" v-model="form.network" class="mt-2"
            :items="[{value: 'evm', title: 'EVM'}, {value: 'bitcoin', title: 'Bitcoin'}]"></v-select>

          <v-text-field label="Wallet*" :placeholder="form.network === 'evm' ? '0x...' : ''"  v-model="form.wallet"  counter
            :rules="[
              v => !!v || 'Required field',
              v => form.network !== 'evm' || /^(0x)?[0-9a-f]{40}$/i.test(v) || 'Invalid EVM format',
              v => form.network !== 'bitcoin' || /^[0-9a-z]{26,35}$/i.test(v) || 'Invalid Bitcoin format',
            ]" />

          <v-autocomplete label="Entity" v-model="form.entity_uuid" placeholder="Type more 3 chars for search" clearable no-filter class="mt-2"
            @update:search="onEntitySearch" :items="entitiesList"></v-autocomplete>
            <!--:search="searchEntityInput" -->
          <v-textarea label="Description" v-model="form.description" rows="2" :rules="[v => !v || v.length <= 1000 || 'Max length is 1000 chars']" class="mt-2" />
        </v-card-text>
        <v-card-actions>
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

</template>

<script>
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { fetchPrivateLabels, savePrivateTag, searchEntities } from "@/api";
import { API_DOMAIN, shortAddress } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
  name: 'PrivateLabelsTable',
  components: { VDataTableServer },
  data() { return {
		API_DOMAIN,
    loading: false,
    per_page: 10,
		page: 1,
		sortBy: [{key: 'date', order: 'desc'}],
    headers: [
      { title: 'Label', key: 'label', align: 'center', sortable: false },
      { title: 'Wallet', key: 'wallet', align: 'center', sortable: false },
      { title: 'Network', key: 'network', align: 'center', sortable: false },
      { title: 'Entity', key: 'entity', align: 'center', sortable: false },
      { title: 'Tags', key: 'tags', align: 'center', sortable: false },
      { title: 'Global Label', key: 'global_label', align: 'center', sortable: false },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    items: [],
    totalItems: 999,
		filter: {
      search: '',
			network: ''
		},

    dialog: false,
    dialogLoader: false,
    valid: true,
    form: {
      id: null,
      label: '',
      wallet: '',
      network: '',
      entity_uuid: '',
      description: '',
    },
    // searchEntityInput: '',
    entitiesList: [],

    deleteDialog: false,
    deleteLoading: false,
    deletedItem: {
      type: null,
      id: null
    },
  }},
	async created() {
		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)
	},
	watch: {
		'filter.search'(newVal) {
			this.debouncedFn()
		},
    'filter.network'(newVal, oldVal) {
      this.loadItems()
    }
	},
  methods: {
		shortAddress,
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

		async loadItems () {
      this.loading = true
      const { data } = await fetchPrivateLabels({
				search: this.filter.search.trim(),
        network: this.filter.network,
				page: this.page,
        per_page: this.per_page,
				sortBy: this.sortBy,
			})
      this.loading = false
      if(data.success) {
				this.items = data.result.items
				this.totalItems = data.result.totalItems
      }
    },

    async editItem(item = null) {
      this.dialog = true
      if(item) {
        this.form.id = item.id
        this.form.label = item.label
        this.form.wallet = item.wallet
        this.form.network = item.network
        this.form.entity_uuid = item.entity_uuid
        this.form.description = item.description
        // this.searchEntityInput = item.entity
        this.entitiesList = [{value: item.entity_uuid, title: item.entity}]
      } else {
        await this.$nextTick(() => this.$refs.form.reset()) // resetValidation()
        this.form.network = 'evm' // default
        this.entitiesList = []
      }
    },
    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      if(false) {
        this.showAlert('error text')
        return
      }
      this.dialogLoader = true
      const { data } = await savePrivateTag(this.form)
      this.dialogLoader = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Successfully updated', color: 'success'})
        await this.loadItems()
      }
    },

    async onEntitySearch(query) {
      console.log('search', query)
      if(query.trim().length <= 2) {
        this.entitiesList = []
        return
      }
      const { data } = await searchEntities(query)
      if(data.success) {
        this.entitiesList = data.result.items.map(i => ({value: i.uuid, title: i.name})) // [{value: 1, title: 'Binance'}, {value: 2, title: 'My Entity'}]
        // this.searchEntityInput = query
      }
    },

    async showDeleteDialog (type, id) {
      this.deleteDialog = true
      this.deletedItem.type = type
      this.deletedItem.id = id
    },
    async deleteItem () {
      this.deleteLoading = true
      const { data } = {data: {success: true}} // await deletePrivateTag(this.deletedItem)
      this.deleteLoading = false
      this.deleteDialog = false
      if (data.success) {
        console.log(data)
        await this.loadItems()
      }
    }
  },
}
</script>
