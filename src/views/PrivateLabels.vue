<template>
  <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
    <div class="d-flex align-center">
      <h1 class="text-h5 mt-2 mb-2">PRIVATE LABELS</h1>
    </div>

    <v-tabs v-model="tab" class="mt-6 mb-6 border-b">
      <v-tab value="labels" class="text-none">LABELS</v-tab>
      <v-tab value="entities" class="text-none">ENTITIES</v-tab>
    </v-tabs>

    <v-window v-model="tab">

      <v-window-item value="labels">
        <PrivateLabelsTable v-if="tab === 'labels'" />
      </v-window-item>

      <v-window-item value="entities">
        <PrivateEntitiesTable v-if="tab === 'entities'" />
      </v-window-item>

    </v-window>
	</v-container>
</template>

<script>
import PrivateLabelsTable from "@/components/privateLabels/PrivateLabelsTable.vue";
import PrivateEntitiesTable from "@/components/privateLabels/PrivateEntitiesTable.vue";

export default {
	name: 'PrivateLabels',
  components: { PrivateEntitiesTable, PrivateLabelsTable },
  head: () => ({ title: 'Private Labels' }),
	data() { return {
    tab: '', // labels | entities
	}},
	created() {
    if(this.$route.hash) {
      const hash = this.$route.hash.slice(1)
      if(['labels', 'entities'].includes(hash))
        this.tab = hash
      else
        this.tab = 'labels'
    }
  },
  watch: {
    tab(newVal, oldVal) {
      if(!oldVal) return
      this.$router.replace({...this.$route, hash: '#'+newVal }) // add ...this.$route for save url query on tab change
    },
  }
}
</script>
