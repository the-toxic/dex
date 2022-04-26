<template>
  <v-simple-table v-if="activeSymbol" fixed-header height="500" >
    <thead>
    <tr>
      <th class="text-left">Date</th>
      <th class="text-left">Type</th>
      <th class="text-left">Price</th>
      <th class="text-left">Amount, {{ leftToken }}</th>
      <th class="text-left">Total, {{ rightToken }}</th>
      <th class="text-left">Maker</th>
      <th class="text-left">Others</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="loading"><td colspan="9" class="text-center"><v-skeleton-loader type="table-tbody" /></td></tr>
    <tr v-else-if="!loading && !rows.length"><td colspan="9" class="text-center">No activity</td></tr>
    <tr v-for="(item, idx) in rows" :key="idx" >
      <td>{{ tsToDate(item.date) }}</td>
      <td>{{ item.type }}</td>
      <td>{{ item.price_usd }}</td>
      <td>{{ item.amount_token0 }}</td>
      <td>{{ item.amount_token1 }}</td>
      <td><a :href="`https://bscscan.com/address/${item.maker}`" target="_blank">{{ shortAddress(item.maker) }}</a></td>
      <td><a :href="`https://bscscan.com/tx/${item.tx}`" target="_blank">Show Tx</a></td>
    </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchHistoryTable } from "@/api";
import { priceFormatter } from "@/helpers/common";

export default {
  name: "TableHistory",
  data() {return {
    loading: false,
  }},
  async created() {},
  computed: {
    ...mapGetters('chart', ['activeSymbol', 'leftToken', 'rightToken', 'lastTXs']),
    rows() {
      return this.lastTXs
    }
  },
  watch: {
    async activeSymbol(newVal, oldVal) {
      this.loading = true
      const {success, result} = await fetchHistoryTable(newVal.pair_id)
      this.loading = false
      if(success && result?.length) {
        result.forEach(item => {
          item.price_usd = priceFormatter(+item.amount_token1/+item.amount_token0)
        })
        await this.$store.dispatch('chart/setLastTXs', result)
      }
    }
  },
  methods: {
    tsToDate: (date) => new Date(date * 1000).toISOString().slice(0, 19).split('T').join(' ')
  }
}
</script>
