<template>
	<router-view />
</template>

<script>
import { fetchChains } from "@/api";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
	name: "Console",
	created() {
		if(!this.chains.length)
			this.loadChains()
	},
	computed: {
		...mapState(useMainStore, {chains: 'chains'})
	},
	methods: {
		...mapActions(useMainStore, {setChains: 'setChains'}),

		async loadChains () {
			const { data } = await fetchChains()
			if(data.success) {
				this.setChains(Object.values(data.result))
			}
		}
	}
}
</script>

