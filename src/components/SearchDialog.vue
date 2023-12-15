<template>
  <v-dialog v-model="dialog" max-width="700" transition="dialog-top-transition">
<!--		<template v-slot:activator="{ props }">-->
<!--			<v-btn v-bind="props" rounded class="text-none mb-2 mb-md-0" color="primary">Search</v-btn>-->
<!--		</template>-->
    <v-card>
<!--			<v-card-title class="mb-3 pt-7" style="font-size: 25px;">Global Search</v-card-title>-->
      <v-text-field v-model="searchInput" placeholder="Wallet address, token, entity, e.g." ref="searchInput"
        :loading="loading" prepend-inner-icon="mdi-magnify" persistent-placeholder hide-details>
        <template v-slot:append-inner><v-btn text="Esc" @click="dialog = false" variant="text" border size="small"/></template>
      </v-text-field>
<!--			<v-card-text>-->
				<v-list v-if="Object.keys(results).length" height="600" density="compact">
					<div v-for="(items, type) in results" class="border">
						<v-list-subheader class="text-uppercase">{{ type }}</v-list-subheader>
						<v-list-item v-for="item in items"
						 :title="`${item.name} ${item.address && '('+shortAddress(item.address)+')'} ${type === 'pairs' ? '['+formatBigNumber(item.swaps_count, 1000, true)+' txs]' : ''}`" @click="onResultClick"
						 :to="{
								name: type === 'entities' ? 'Entity' : (type === 'tokens' ? 'Token' : (type === 'pairs' ? 'Pair' : 'Address')),
								params: { id: (type === 'entities' ? item.id : item.address) }
						 }">
							<template v-slot:prepend>
								<TokenIcon v-if="type === 'tokens' || type === 'entities'" :src="itemIconSrc(type, item.address || item.id, item.chain_id)" error-size="small" width="24" class="mr-1" />
								<template v-else-if="type === 'pairs'">
									<TokenIcon :src="itemIconSrc('tokens', item.token0_address, item.chain_id)" error-size="small" width="24" class="mr-1" />
									<TokenIcon :src="itemIconSrc('tokens', item.token1_address, item.chain_id)" error-size="small" width="24" class="mr-1" />
								</template>
							</template>
						</v-list-item>
					</div>
				</v-list>
				<v-alert v-else min-height="600" height="100%" color="transparent" class="text-center">
          <v-icon icon="mdi-text-box-search-outline" size="150" color="disabled" />
          <div class="text-disabled">Your search results will appear here</div>
        </v-alert>
<!--			</v-card-text>-->
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useDebounceFn } from "@vueuse/core";
import { useMainStore } from "@/store/mainStore";
import { fetchSearch } from "@/api";
import { API_DOMAIN, formatBigNumber, formatNumber, shortAddress } from "@/helpers/mixins";
import TokenIcon from "@/components/UI/TokenIcon.vue";

export default {
  name: "SearchDialog",
	components: { TokenIcon },
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
			if(!data.canceled)
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
		formatBigNumber, shortAddress,
    ...mapActions(useMainStore, {showAlert: 'showAlert', toggleSearchDialog: 'toggleSearchDialog'}),

		itemIconSrc(type, address, chain_id = null) {
      if(type === 'tokens') {
        const iconFolder = !this.chains ? null : this.chains[chain_id]['icon_folder']
        return !iconFolder ? '' : `${API_DOMAIN}${iconFolder}${address.toLowerCase().slice(0,4)}/${address.toLowerCase()}/default.png`
      } else if(type === 'entities') {
        return API_DOMAIN + `/images/entities/${address.slice(0,1)}/${address}.png`
      }
		},
		onResultClick() {
			this.searchInput = ''
			this.dialog = false
		}
  }
}
</script>
