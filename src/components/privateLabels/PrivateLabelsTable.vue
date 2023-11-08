<template>

  <div class="d-flex justify-space-between align-center flex-wrap px-4 py-4 border-b" style="background: #141d26">
    <v-btn @click="editItem()" variant="tonal" prepend-icon="mdi-plus" color="success" rounded class="text-none" >Add Label</v-btn>
    <v-spacer />
    <div style="width: 115px;">
      <v-select label="Network" v-model="filter.chain_type" hide-details variant="outlined" rounded density="compact"
        :items="['All', ...chainTypes]" />
    </div>
    <div style="width: 240px;">
      <v-text-field v-model="filter.search" label="Search" placeholder="Label, address, e.g." rounded variant="outlined"
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
    :items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"
  >
    <template v-slot:item.address="{ item }">
      <v-btn :to="{name: 'Console'}" rounded variant="text" :title="item.address" :active="false" class="text-none">{{ shortAddress(item.address) }}</v-btn>
      <v-btn icon="mdi-content-copy" variant="text" size="x-small" @click="$clipboard(item.address)" />
    </template>
    <template v-slot:item.local_label="{ item }">
      <v-btn v-if="item.local_label" :to="{name: 'Console'}" rounded variant="text" :title="item.local_label" :active="false" class="text-none">{{ item.local_label }}</v-btn>
      <span v-else>&mdash;</span>
    </template>
    <template v-slot:item.global_label="{ item }">{{ item.global_label ? item.global_label : '&mdash;' }}</template>
    <template v-slot:item.chain_type="{ item }"><v-chip color="secondary" class="text-capitalize" size="small">{{ item.chain_type }}</v-chip></template>
    <template v-slot:item.entity_name="{ item }">{{ item.entity_name ? item.entity_name : '&mdash;' }}</template>
    <template v-slot:item.tags="{ item }"><span v-if="!item.tags.length">&mdash;</span><div v-else class="overflow-x-auto text-no-wrap mx-auto" style="width: 300px"><v-chip v-for="i in item.tags" color="white" class="mr-1 my-1" size="small" :text="i.tag" /></div></template>
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
          <v-text-field label="Label*" v-model="form.local_label" placeholder="Custom name"
            :rules="[v => !v || v.length < 64 || 'Max length 64 chars']" />

          <v-select label="Network*" v-model="form.chain_type" class="mt-2" :items="chainTypes"></v-select>

          <v-text-field label="Address*" :placeholder="form.chain_type === 'EVM' ? '0x...' : ''"  v-model="form.address"  counter
            :rules="[
              v => !!v || 'Required field',
              ...chainTypeWalletRules(form.chain_type)
            ]" />

          <v-autocomplete label="Entity" v-model="form.entity_uuid" placeholder="Type more 3 chars for search"
            @update:search="onEntitySearch" :items="entitiesList" :loading="entitiesLoading" clearable no-filter class="mt-2"></v-autocomplete>

          <v-textarea label="Note" v-model="form.description" rows="2" :rules="[v => !v || v.length <= 1000 || 'Max length is 1000 chars']" class="mt-2" />
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
import { fetchPrivateLabels, savePrivateLabel, searchEntities, removePrivateLabel } from "@/api";
import { API_DOMAIN, chainTypeWalletRules, shortAddress } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
  name: 'PrivateLabelsTable',
  components: { VDataTableServer },
  data() { return {
		API_DOMAIN,
    IS_DEBUG: 0,
    loading: false,
    per_page: 20,
		page: 1,
		sortBy: [{key: 'date', order: 'desc'}],
    headers: [
      { title: 'Address', key: 'address', align: 'center', sortable: false },
      { title: 'Label', key: 'local_label', align: 'center', sortable: false },
      { title: 'Network', key: 'chain_type', align: 'center', sortable: false },
      { title: 'Entity', key: 'entity_name', align: 'center', sortable: false },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
    ],
    items: [],
    totalItems: 0,
		filter: {
      search: '',
			chain_type: 'All'
		},

    dialog: false,
    dialogLoader: false,
    valid: true,
    form: {
      id: null,
      local_label: '',
      address: '',
      chain_type: '',
      entity_uuid: '',
      description: '',
    },
    entitiesList: [],
    entitiesLoading: false,

    deleteDialog: false,
    deleteLoading: false,
    deletedItem: {
      type: null,
      id: null
    },
  }},
	async created() {
    if('debug' in this.$route.query) this.IS_DEBUG = 1
    if(this.IS_DEBUG) {
      this.headers.push({ title: 'Tags', key: 'tags', align: 'center', sortable: false, width: 300 })
      this.headers.push({ title: 'Global Label', key: 'global_label', align: 'center', sortable: false })
    }

		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)

    this.searchDebouncedFn = useDebounceFn(async (query) => {
      await this.entitySearch(query)
    }, 500)
	},
	watch: {
		'filter.search'(newVal) {
			this.debouncedFn()
		},
    'filter.chain_type'(newVal, oldVal) {
      this.loadItems()
    },
	},
  computed: {
    ...mapState(useMainStore, {chainTypes: 'chainTypes'})
  },
  methods: {
		shortAddress, chainTypeWalletRules,
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

		async loadItems () {
      this.loading = true
      const { data } = await fetchPrivateLabels({
				search: this.filter.search.trim(),
        chain_type: this.filter.chain_type,
				page: this.page,
        per_page: this.per_page,
				sortBy: this.sortBy,
        debug: this.IS_DEBUG,
        is_unused: 0
			})
      this.loading = false
      if(data.success) {
				this.items = data.result.items
				this.totalItems = data.result.total
      }
    },

    async editItem(item = null) {
      this.dialog = true
      this.entitySearch('').then()

      if(item) {
        this.form.id = item.id
        this.form.local_label = item.local_label
        this.form.address = item.address
        this.form.chain_type = item.chain_type
        this.form.description = item.description
        this.form.entity_uuid = item.entity_uuid
        this.entitiesList = item.entity_uuid ? [{value: item.entity_uuid, title: item.entity_name}] : []
      } else {
        await this.$nextTick(() => this.$refs.form.reset()) // resetValidation()
        this.form.id = null
        this.form.chain_type = 'EVM' // default
        this.entitiesList = []
      }
    },
    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      this.dialogLoader = true
      const { data } = await savePrivateLabel(this.form)
      this.dialogLoader = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Successfully updated', color: 'success'})
        await this.loadItems()
      }
    },

    async onEntitySearch(query) {
      if(query.trim().length && query.trim().length <= 2) return
      await this.searchDebouncedFn(query)
    },
    async entitySearch(query) {
      this.entitiesLoading = true
      const { data } = await searchEntities(query)
      this.entitiesLoading = false

      if(data.success) {
        this.entitiesList = data.result.items.map(i => ({
          value: i.uuid,
          title: i.name,
          props: { subtitle: i.owner === 'user' ? ' Private Entity' : ''}
        }))
      }
    },

    async showDeleteDialog (type, id) {
      this.deleteDialog = true
      this.deletedItem.type = type
      this.deletedItem.id = id
    },
    async deleteItem () {
      this.deleteLoading = true
      const { data } = await removePrivateLabel(this.deletedItem.id)
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
