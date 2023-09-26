<template>
  <v-dialog v-model="dialog" max-width="700" transition="dialog-top-transition">
<!--		<template v-slot:activator="{ props }">-->
<!--			<v-btn v-bind="props" rounded class="text-none mb-2 mb-md-0" color="primary">Search</v-btn>-->
<!--		</template>-->
    <v-card class="rounded-xl">
			<v-card-title class="mb-3 pt-7" style="font-size: 25px;">Global Search</v-card-title>
			<v-card-text class="mb-4">
				<v-text-field v-model="searchInput" placeholder="Wallet address, token, entity, e.g." ref="searchInput"
					:loading="loading" persistent-placeholder class="mb-2"></v-text-field>
				<v-list v-if="Object.keys(results).length" height="600" density="compact">
					<template v-for="(items, type) in results">
						<v-list-subheader class="text-uppercase">{{ type }}</v-list-subheader>
						<v-list-item v-for="item in items"
						 :title="`${item.name} ${item.address && '('+shortAddress(item.address)+')'}`" @click="onResultClick"
						 :to="{
								name: type === 'entities' ? 'Entity' : (type === 'tokens' ? 'Token' : (type === 'pairs' ? 'Pair' : 'Wallet')),
								params: { [type === 'pairs' ? 'pairAddr' : 'id']: (type === 'entities' ? item.id : item.address) }
						 }"
						  >
							<template v-slot:prepend>
								<v-img v-if="type === 'tokens'" :src="tokenIconSrc(item)" width="24" height="24" class="va-top rounded-xl mr-1">
									 <template v-slot:error><div class="bg-grey-darken-3 fill-height text-center fs14" style="padding-top: 2px">?</div></template>
								</v-img>
							</template>
						</v-list-item>
					</template>
				</v-list>
				<v-alert v-else height="500" class="text-center bg-blue-grey-darken-4">Please enter search query</v-alert>
			</v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import { useMainStore } from "@/store/mainStore";
import { fetchSearch } from "@/api";
import { API_DOMAIN, shortAddress } from "@/helpers/mixins";

export default {
  name: "SearchDialog",
  props: {
		query: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
			searchInput: '',
			results: {}
    }
  },
	created() {
		this.debouncedFn = useDebounceFn(async () => {
			if(!this.searchInput.trim()) {
				this.results = {}; return
			}
			this.loading = true
			const {data} = await fetchSearch(this.searchInput)
			this.loading = false
			if(data.success) {
				Object.keys(data.result).map(k => {
					if(!data.result[k].length)
						delete data.result[k]
				})
				this.results = data.result
			}
		}, 1000)
	},
	watch: {
		searchInput(newVal) {
			this.debouncedFn()
		},
		searchDialog(newVal) {
			this.dialog = newVal
			this.$nextTick(() => this.$refs['searchInput'].focus())
		},
		dialog(newVal) {
			this.toggleSearchDialog(newVal)
		}
	},
  computed: {
		...mapState(useMainStore, {searchDialog: 'searchDialog', chains: 'chains'}),

	},
  methods: {
		shortAddress,
    ...mapActions(useMainStore, {showAlert: 'showAlert', toggleSearchDialog: 'toggleSearchDialog'}),

		tokenIconSrc(item) {
			const iconFolder = !this.chains ? null : this.chains[item.chain_id]['icon_folder']
			return !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${item.address.toLowerCase().slice(0,4)}/${item.address.toLowerCase()}/default.png`
		},
		onResultClick() {
			this.searchInput = ''
			this.dialog = false
		}
  }
}
</script>
