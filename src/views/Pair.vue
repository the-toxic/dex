<template>
  <v-card :title="`Network: ${networkName} (${networkId})`" :subtitle="`Contract: ${id}`" class="mb-8"></v-card>
  <v-row>
    <v-col cols="12" md="3">
      <v-select hide-details label="Select Network" variant="outlined"
        v-model="networkSelect"
        :items="Object.values(networks)"
      />
    </v-col>
    <v-col cols="12" md="9">
      <v-text-field label="Search pair" variant="outlined" />
    </v-col>
  </v-row>

  <Chart />

  <TableHistory class="mt-6" />

</template>

<script>
import Chart from "../components/Chart.vue";
import TableHistory from "../components/TableHistory.vue";

export default {
  name: 'Pair',
  components: {TableHistory, Chart},
  data() { return {
    networkId: '',
    networkSelect: '',
    id: '',
    // networks: [{text: 'BNB Chain', value: 'bsc'}, {text: 'Ethereum', value: 'ether'}, {text: 'Polygon', value: 'polygon'}]
    networks: {bsc: 'BNB Chain', ether: 'Ethereum', polygon: 'Polygon'}
  }},
  async created() {
    const networkId = this.$route.params.network.toString()
    if(!Object.keys(this.networks).includes(networkId))
      return this.$router.push({name: 'Home'})

    this.networkId = networkId
    this.id = this.$route.params.id
    this.networkSelect = this.networks[networkId]
  },
  async beforeRouteUpdate(to, from) {
    // console.log('beforeRouteUpdate', to)
    this.networkId = to.params.network
    this.id = to.params.id
  },
  watch: {
    networkSelect(val) {
      this.$router.push({params: {network: this.networkNameToId(val)}})
    }
  },
  computed: {
    networkName() {
      return this.networks[this.networkId]
    }
  },
  methods: {
    networkNameToId(name) {
      const idx = Object.values(this.networks).findIndex(i => i === name)
      return Object.keys(this.networks)[idx]
    }
  }
}
</script>