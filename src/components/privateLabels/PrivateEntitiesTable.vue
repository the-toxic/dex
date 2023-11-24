<template>

  <div class="d-flex justify-center align-center flex-wrap px-4 py-3 rounded-t bg-surface2">
    <v-btn @click="editItem()" variant="tonal" prepend-icon="mdi-plus" color="success" rounded class="text-none" >Add Entity</v-btn>
    <v-spacer />
    <div style="width: 280px;">
      <v-text-field v-model="filter.search" label="Search" placeholder="Entity name, UUID e.g." rounded variant="outlined"
        persistent-placeholder density="compact" prepend-inner-icon="mdi-magnify" hide-details  clearable @click:clear="filter.search = ''" class="ml-4"/>
    </div>
  </div>

  <v-data-table-server
    v-model:items-per-page="per_page"
    v-model:sort-by="sortBy"
    v-model:page="page"
    :headers="headers"
    :items-length="totalItems"
    :items="items"
    :loading="loading"
    class="elevation-1 fs14"
		density="comfortable"
    @update:options="loadItems"
    :items-per-page-options="[20,50,100]"
  >
    <template v-slot:item.uuid="{ item }">
      <v-btn :to="{name: 'Entity', params: {id: item.uuid}}" rounded variant="text" density="comfortable" :title="item.uuid" :active="false" class="text-none">{{ item.uuid.slice(0, 12) + '...' }}</v-btn>
      <v-btn icon="mdi-content-copy" variant="text" size="x-small" @click="$clipboard(item.uuid)" />
    </template>
    <template v-slot:item.name="{ item }">
<!--      <img :src="iconPath(item.uuid)" class="va-middle" style="max-height: 40px" />-->
			<div class="d-inline-block overflow-hidden va-middle mr-3" style="width: 40px; height: 40px; border-radius: 50%;">
				<TokenIcon :src="iconPath(item.uuid)" width="40" class="mr-1" />
			</div>
<!--      <v-btn :to="{name: 'Entity', params: {id: item.uuid}}" rounded variant="text" density="comfortable" :active="false" class="text-none" width="250">{{ item.name.slice(0, 30) }}</v-btn>-->
      <router-link :to="{name: 'Entity', params: {id: item.uuid}}" class="d-inline-block text-left text-white text-decoration-none" style="width: 250px">{{ item.name.slice(0, 30) }}</router-link>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn @click="editItem(item)" icon="mdi-eye-outline" variant="text" size="small" color="secondary"></v-btn>
      <v-btn @click="showDeleteDialog('entity', item.uuid)" icon="mdi-trash-can-outline" variant="text" size="small" color="error"></v-btn>
    </template>
  </v-data-table-server>

  <v-dialog v-model="dialog" max-width="730">
    <v-card :loading="dialogLoader">
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
        <v-card-title class="mb-3 pt-7" style="font-size: 25px;">Entity Editor</v-card-title>
        <v-card-text>
          <v-text-field label="Entity Name*" v-model="form.name" class="mb-2" :rules="[v => !!v || 'Required field']" density="compact" />

          <div class="bg-blue-grey-darken-4 float-right d-flex align-center rounded overflow-hidden ml-2" style="width: 56px; height: 56px; border-radius: 50%!important;">
            <img ref="touchImageRef" v-show="form.file && form.file.length" style="max-width: 100%; max-height: 100%" />
						<TokenIcon v-show="!form.file || !form.file.length" :src="iconPath()" width="56" error-size="xx-large" />
          </div>

          <v-file-input label="Upload Icon" v-model="form.file" accept="image/*"  prepend-inner-icon="mdi-account-box-outline" prepend-icon=""
            show-size clearable :rules="[v => !v || !v.length || v[0].size < 500_000 || 'Image size should be less than 500kB!']"></v-file-input>

          <v-autocomplete label="Private Labels" v-model="form.wallets" multiple chips closable-chips return-object placeholder="Type more 3 chars for search"
            @update:search="onLabelSearch" :items="labelsList" :loading="labelsLoading" no-filter class="mt-2"></v-autocomplete>

        </v-card-text>
				<v-card-actions class="px-4 pt-0 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false" color="disabled" class="text-none">Close</v-btn>
          <v-btn type="submit" variant="outlined" color="secondary" :loading="dialogLoader" :disabled="dialogLoader" class="text-none">Save</v-btn>
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
import { fetchPrivateEntities, fetchPrivateLabels, getPrivateEntity, removePrivateEntity, savePrivateEntity } from "@/api";
import { API_DOMAIN, shortAddress } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";
import TokenIcon from "@/components/UI/TokenIcon.vue";

export default {
  name: 'PrivateEntitiesTable',
	components: { TokenIcon },
  data() { return {
		API_DOMAIN,
    IS_DEBUG: 0,
    loading: false,
    per_page: 20,
		page: 1,
		sortBy: [{key: 'id', order: 'desc'}],
		network: 'bsc', // ether | bsc
    headers: [
      { title: 'UUID', key: 'uuid', align: 'center', sortable: false },
      { title: 'Name', key: 'name', align: 'center', sortable: false },
      { title: 'Wallets', key: 'wallets', align: 'center', sortable: false },
      { title: 'Action', key: 'action', align: 'center', sortable: false },
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
      uuid: '',
      name: '',
      file: null,
      labels: []
    },
    labelsList: [],
    labelsLoading: false,

    deleteDialog: false,
    deleteLoading: false,
    deletedItem: {
      type: null,
      id: null
    },
  }},
	async created() {
    if('debug' in this.$route.query) this.IS_DEBUG = 1

		this.debouncedFn = useDebounceFn(async () => {
			await this.loadItems()
		}, 500)

    this.searchDebouncedFn = useDebounceFn(async (query) => {
      await this.searchLabels(query)
    }, 500)
	},
	watch: {
		'filter.search'(newVal) {
			this.debouncedFn()
		},
    'form.file'(newVal, oldVal) {
      if(newVal && newVal.length) {
        console.log(newVal[0])
        this.$refs['touchImageRef'].src = URL.createObjectURL(this.form.file[0])
      } else if('src' in this.$refs['touchImageRef']){
        URL.revokeObjectURL(this.$refs['touchImageRef'].src)
        this.$refs['touchImageRef'].src = ''
      }
    }
	},
  computed: {
    ...mapState(useMainStore, {chainTypes: 'chainTypes'}),
  },
  methods: {
		shortAddress,
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

		async loadItems () {
      this.loading = true
      const { data } = await fetchPrivateEntities({
				search: this.filter.search.trim(),
				page: this.page,
				per_page: this.per_page,
				sortBy: this.sortBy,
        debug: this.IS_DEBUG
			})
      this.loading = false
      if(data.success) {
        this.items = data.result.items
				this.totalItems = data.result.total
      }
    },

    async editItem(item = null) {
      this.dialog = true
      await this.$nextTick(() => this.$refs.form.reset()) // or resetValidation() // cleat only v-model fields: name
      this.form.uuid = null
      this.form.wallets = []
      this.labelsList = []

      if(item) {
        this.dialogLoader = true
        const { data } = await getPrivateEntity(item.uuid)
        this.dialogLoader = false
        if(!data.success) {
          this.showAlert('Error on load entity')
          return
        }
        this.form.uuid = data.result.entity.uuid
        this.form.name = data.result.entity.name
        await this.searchLabels('') //step 1 - set
        data.result.wallets.forEach(item => {
          this.form.wallets.push({value: item.id, title: item.local_label, props: { subtitle: item.address}})
          this.labelsList.push({value: item.id, title: item.local_label, props: { subtitle: item.address}}) //step 2 - add
        })
      } else {
        await this.searchLabels('')
      }
    },

    iconPath(uuid = null) {
      if(!uuid) uuid = this.form.uuid || ''
      // return !uuid ? '' : API_DOMAIN + `/images/entities/${uuid.slice(0,1)}/${uuid}.png?v=${Math.round(Math.random() * 10000)}`
      return !uuid ? '' : API_DOMAIN + `/images/entities/${uuid.slice(0,1)}/${uuid}.png`
    },

    async onLabelSearch(query) {
      if(query.trim().length && query.trim().length <= 2) return
      await this.searchDebouncedFn(query)
    },
    async searchLabels(query) {
      this.labelsLoading = true
      const { data } = await fetchPrivateLabels({
        search: query.trim(),
        debug: 0,
        is_unused: 1
      })
      this.labelsLoading = false

      if(data.success) {
        this.labelsList = data.result.items.map(item => ({
          value: item.id,
          title: item.local_label || '?',
          props: { subtitle: item.address}
        }))
      }
    },

    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      const formData = new FormData();
      formData.append("uuid", this.form.uuid);
      formData.append("name", this.form.name);
      formData.append("wallets", JSON.stringify(this.form.wallets.map(i => i.value)));
      if(this.form.file && this.form.file.length)
        formData.append("file", this.form.file[0]);

      this.dialogLoader = true
      const { data } = await savePrivateEntity(formData)
      this.dialogLoader = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Successfully updated', color: 'success'})
        await this.loadItems()
      }
    },

    async showDeleteDialog (type, id) {
      this.deleteDialog = true
      this.deletedItem.type = type
      this.deletedItem.id = id
    },
    async deleteItem () {
      this.deleteLoading = true
      const { data } = await removePrivateEntity(this.deletedItem.id)
      this.deleteLoading = false
      this.deleteDialog = false

      if (data.success) {
        this.showAlert({msg: 'Successfully removed', color: 'success'})
        await this.loadItems()
      }
    }
  },
}
</script>
