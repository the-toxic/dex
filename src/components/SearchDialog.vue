<template>
  <v-dialog v-model="dialog" max-width="700" transition="dialog-top-transition">
<!--		<template v-slot:activator="{ props }">-->
<!--			<v-btn v-bind="props" rounded class="text-none mb-2 mb-md-0" color="primary">Search</v-btn>-->
<!--		</template>-->
    <v-card :loading="loading" class="rounded-xl">
			<v-card-title class="mb-3 pt-7" style="font-size: 25px;">Global Search</v-card-title>
			<v-card-text class="mb-4">
				<v-text-field v-model="searchInput" placeholder="Wallet address, token, entity, e.g." ref="searchInput"
					persistent-placeholder class="mb-2"></v-text-field>
				<v-list v-if="results.length" height="500">
					<v-list-item v-for="item in results"
					 :title="item.name || item.address" @click="onResultClick"
					 :subtitle="item.type"
					 :to="{
						  name: item.type === 'entity' ? 'Entity' : (item.type === 'token' ? 'Token' : 'Wallet'),
					 		params: {id: item.type === 'entity' ? item.id : item.address}
					 }" ></v-list-item>
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
			results: []
    }
  },
	created() {
		this.debouncedFn = useDebounceFn(async () => {
			if(!this.searchInput.trim()) {
				this.results = []; return
			}
			this.loading = true
			const {data} = await fetchSearch(this.searchInput)
			this.loading = false
			if(data.success) {
				this.results = Object.values(data.result)
			}
		}, 500)
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
		...mapState(useMainStore, {searchDialog: 'searchDialog'})
	},
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert', toggleSearchDialog: 'toggleSearchDialog'}),

		onResultClick() {
			this.searchInput = ''
			this.dialog = false
		}
  }
}
</script>
