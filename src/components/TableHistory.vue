<template>
  <v-simple-table v-if="activeSymbol" fixed-header height="1000" class="text-center">
    <thead>
    <tr>
      <th class="text-center">Date</th>
      <th class="text-center">Type</th>
      <th class="text-center">Price</th>
      <th class="text-center">{{ leftToken }}</th>
      <th class="text-center">{{ rightToken }}</th>
      <th class="text-center">Aggregator</th>
      <th class="text-center">Maker</th>
      <th class="text-center">Receiver</th>
      <th class="text-center">Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="loading"><td colspan="9"><v-skeleton-loader type="table-tbody" /></td></tr>
    <tr v-else-if="!loading && !rows.length"><td colspan="9">No activity</td></tr>
    <tr v-for="(item, idx) in rows" :key="idx"
        :class="item.type === 'buy' ? 'green--text' : 'red--text'" >
        <!-- :style="{backgroundColor: item.type === 'buy' ? '#192a19' : '#2a1919'}" -->
      <td>{{ item.parsedDate }}</td>
      <td class="text-uppercase">{{ item.type }}</td>
      <td>{{ toNumber(item.parsedPrice) }}</td>
      <td>{{ toNumber(item.amount_token0) }}</td>
      <td>{{ toNumber(item.amount_token1) }}</td>
      <td>Pancake v2</td>
      <td><a :href="`https://bscscan.com/address/${item.maker}`" target="_blank" class="text-decoration-none">{{ shortAddress(item.maker) }}</a></td>
      <td><a :href="`https://bscscan.com/address/${item.receiver}`" target="_blank" class="text-decoration-none">{{ shortAddress(item.receiver) }}</a></td>
      <td><a :href="`https://bscscan.com/tx/${item.tx}`" target="_blank" class="text-decoration-none">Show Tx</a></td>
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
      // const items = Object.assign([], this.lastTXs)
      // const items = [...this.lastTXs]
      return this.lastTXs.map(item => {
        item.parsedPrice = priceFormatter(+item.amount_token1/+item.amount_token0)
        item.parsedDate = new Date((item.date + this.tzOffset) * 1000).toISOString().slice(0, 19).split('T').join(' ')
        return item
      })
      // return this.lastTXs
    },
    tzOffset: () => -(new Date().getTimezoneOffset()) * 60
  },
  watch: {
    async activeSymbol(newVal, oldVal) {
      if(!newVal) return
      this.loading = true
      const {success, result} = await fetchHistoryTable(newVal.pair_id)
      this.loading = false
      if(success && result?.length) {
        result.forEach(item => {
          // if(newVal.needInvert) {
          //   const oldAmount0 = item.amount_token0
          //   item.amount_token0 = item.amount_token1
          //   item.amount_token1 = oldAmount0
          // }
        })
        await this.$store.dispatch('chart/setLastTXs', result)
      }
    }
  }
}
</script>
