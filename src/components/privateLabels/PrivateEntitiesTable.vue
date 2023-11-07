<template>

  <div class="d-flex justify-space-between align-center flex-wrap px-4 py-2 border-b" style="background: #141d26">
    <v-btn @click="editItem()" variant="tonal" prepend-icon="mdi-plus" color="success" rounded class="text-none" >Add Entity</v-btn>
    <v-spacer />
    <div style="width: 280px;">
      <v-text-field v-model="filter.search" label="Search" placeholder="Labels, wallets, entities, e.g." rounded variant="outlined"
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
    @update:options="loadItems"
    :items-per-page-options="[{value: 20, title: '20'}, {value: 50, title: '50'}, {value: 100, title: '100'}]"
  >
    <template v-slot:item.uuid="{ item }"><v-btn @click="$clipboard(item.uuid)" rounded variant="text" density="comfortable" :title="item.uuid" :active="false" class="text-none">{{ item.uuid.slice(0, 12) + '...' }}</v-btn></template>
    <template v-slot:item.wallet="{ item }"><v-btn :to="{name: 'Console'}" rounded variant="text" :active="false" class="text-none">{{ shortAddress(item.wallet) }}</v-btn></template>
    <template v-slot:item.type="{ item }"><v-chip :color="item.type === 'adds' ? 'success':'error'" class="text-uppercase" size="small">{{ item.type }}</v-chip></template>
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

          <div class="bg-blue-grey-darken-4 float-right d-flex align-center rounded ml-2" style="width: 56px; height: 56px">
            <img ref="touchImageRef" v-show="form.file && form.file.length" style="max-width: 100%; max-height: 100%" />
            <v-img v-show="!form.file || !form.file.length" :src="iconPath" width="56" height="56">
              <!-- <template v-slot:error>?</template>-->
              <template v-slot:placeholder><div class="d-flex align-center justify-center fill-height">
                <v-icon icon="mdi-help-rhombus-outline" size="xx-large" />
              </div></template>
            </v-img>
          </div>

          <v-file-input label="Upload Icon" v-model="form.file" accept="image/*"  prepend-inner-icon="mdi-account-box-outline" prepend-icon=""
            show-size clearable :rules="[v => !v || !v.length || v[0].size < 500_000 || 'Image size should be less than 500kB!']"></v-file-input>

          <v-divider />
          <div class="d-flex justify-space-between align-center mt-4 mb-4">
            <h4 class="fs16">Wallets</h4>
            <v-btn @click="addEmptyWallet" rounded variant="tonal" size="small" class="text-none" prepend-icon="mdi-wallet-plus-outline">Add Wallet</v-btn>
          </div>
          <div v-if="!form.wallets.length">Please click button "Add Wallet"</div>

          <div v-for="(wallet, idx) in form.wallets" :key="idx"
             class="v-row v-row--no-gutters justify-space-between align-center mb-6 mb-md-1">

            <div class="v-col-12 mb-1">
              <div class="d-flex justify-space-between align-center">
                <div><template v-if="wallet.global_label"><span class="text-disabled">Global Label:</span> {{ wallet.global_label }}</template></div>
                <div>
                  <v-btn v-if="!wallet.is_deleted" @click="removeWallet(wallet)" icon="mdi-close" color="error" variant="text" size="small" density="comfortable" class="" />
                  <v-btn v-else @click="wallet.is_deleted = 0" icon="mdi-restore" color="error" variant="text" size="small" density="comfortable" class="" />
                </div>
              </div>
            </div>

            <div class="v-col-12 v-col-md-3">
              <v-text-field label="My Label" v-model="wallet.local_label" placeholder="Custom name" density="compact" :disabled="!!wallet.is_deleted" :rules="[v => !v || v.length < 64 || 'Max length 64 chars']" />
            </div>
            <div class="v-col-12 v-col-md-7">
              <v-text-field label="Address*" :placeholder="wallet.chain_type === 'EVM' ? '0x...' : ''"  v-model="wallet.address" class="mx-md-3" density="compact" :disabled="!!wallet.is_deleted"
                :rules="[
                  v => !!v || 'Required field',
                  ...chainTypeWalletRules(wallet.chain_type)
                ]" />
            </div>
            <div class="v-col-12 v-col-md-2">
<!--              <v-btn variant="outlined" color="white" rounded class="mt-n5" size="small">EVM</v-btn>-->
              <v-select label="Network" v-model="wallet.chain_type" :items="chainTypes" density="compact" :disabled="!!wallet.is_deleted" class="flex-grow-0" />
<!--              <v-btn v-if="!wallet.is_deleted" @click="removeWallet(wallet)" icon="mdi-close" color="error" variant="text" size="small" density="comfortable" class="mt-n5 ml-4" />-->
<!--              <v-btn v-else @click="wallet.is_deleted = 0" icon="mdi-restore" color="error" variant="text" size="small" density="comfortable" class="mt-n5 ml-4" />-->
            </div>
            <div v-if="wallet.tags.length" class="v-col-12 mb-4">
              <v-select label="Tags" :items="wallet.tags" :model-value="wallet.tags.map(i => i.id)" chips multiple
                item-title="tag" item-value="id" variant="outlined" density="comfortable" readonly hide-details />
            </div>
            <v-divider class="mb-2" />
          </div>
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
import { fetchPrivateEntities, getPrivateEntity, removePrivateEntity, savePrivateEntity } from "@/api";
import { API_DOMAIN, chainTypeWalletRules, shortAddress } from "@/helpers/mixins";
import { useDebounceFn } from "@vueuse/core";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
  name: 'PrivateEntitiesTable',
  components: { VDataTableServer },
  data() { return {
		API_DOMAIN,
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
      wallets: []
    },

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
    iconPath() {
      return this.form.uuid ? API_DOMAIN + `/images/entities/${this.form.uuid}.png?v=${Math.round(Math.random() * 10000)}` : ''
    }
  },
  methods: {
    chainTypeWalletRules,
		shortAddress,
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

		async loadItems () {
      this.loading = true
      const { data } = await fetchPrivateEntities({
				search: this.filter.search.trim(),
				page: this.page,
				per_page: this.per_page,
				sortBy: this.sortBy,
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
        data.result.wallets = data.result.wallets.map(i => {
          i.is_deleted = 0
          return i
        })
        this.form.wallets = JSON.parse(JSON.stringify(data.result.wallets))
      } else {
        this.addEmptyWallet()
      }
    },
    addEmptyWallet() {
      this.form.wallets.push({id: 'new', local_label: '', address: '', chain_type: 'EVM', tags: []})
    },
    async removeWallet(wallet) {
      if(wallet.id !== 'new') {
        wallet.is_deleted = 1
      } else {
        this.form.wallets = this.form.wallets.filter(item => item !== wallet)
      }
    },
    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      const wallets = this.form.wallets.filter(i => !i.is_deleted)
      if(!wallets.length) {
        this.showAlert('Add at least 1 address')
        return
      }
      this.dialogLoader = true

      const formData = new FormData();
      formData.append("uuid", this.form.uuid);
      formData.append("name", this.form.name);
      formData.append("wallets", JSON.stringify(this.form.wallets));
      if(this.form.file && this.form.file.length)
        formData.append("file", this.form.file[0]);

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
