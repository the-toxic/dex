<template>
  <RecycleScroller v-if="activeSymbol"
    :item-size="30"
    key-field="tx_id"
    :items="rows"
    class="txsTable">

    <template #before>
      <div class="txsTableTd">Date</div>
      <div class="txsTableTd">Type</div>
      <div class="txsTableTd">Price</div>
      <div class="txsTableTd">{{ leftToken }}</div>
      <div class="txsTableTd">{{ rightToken }}</div>
      <div class="txsTableTd">Aggregator</div>
      <div class="txsTableTd">Maker</div>
      <div class="txsTableTd">Receiver</div>
      <div class="txsTableTd">Actions</div>
    </template>

    <template #after>
      <div v-if="loading" class="text-center flex-fill"><v-skeleton-loader type="table-tbody" /> <v-skeleton-loader type="table-tbody" /></div>
      <div v-else-if="!loading && !rows.length" class="text-center flex-fill">No activity</div>
      <div v-if="!loading && rows.length" v-intersect="infiniteScrolling" class="text-center flex-fill">
        <v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" />
      </div>
    </template>

    <template v-slot="{ item }" v-if="!loading && rows.length">
      <div class="txsTableTd">{{ item.parsedDate }}</div>
      <div class="txsTableTd text-uppercase">{{ item.type }}</div>
      <div class="txsTableTd">{{ priceFormatter(item.parsedPrice) }}</div>
      <div class="txsTableTd">{{ priceFormatter(item.amount_token0) }}</div>
      <div class="txsTableTd">{{ priceFormatter(item.amount_token1) }}</div>
      <div class="txsTableTd">
        <a v-if="item.router.address" :href="`https://bscscan.com/address/${item.router.address}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ item.router.title }}</a>
        <span v-else>{{ item.router.title }}</span>
      </div>
      <div class="txsTableTd"><a :href="`https://bscscan.com/address/${item.maker}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.maker) }}</a></div>
      <div class="txsTableTd"><a :href="`https://bscscan.com/address/${item.receiver}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.receiver) }}</a></div>
      <div class="txsTableTd"><a :href="`https://bscscan.com/tx/${item.tx}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">Show Tx</a></div>
    </template>
  </RecycleScroller>
<!--  <v-simple-table v-if="activeSymbol" fixed-header height="1000" class="myTable text-center">-->
<!--    <thead>-->
<!--    <tr>-->
<!--      <th class="text-center">Date</th>-->
<!--      <th class="text-center">Type</th>-->
<!--      <th class="text-center">Price</th>-->
<!--      <th class="text-center">{{ leftToken }}</th>-->
<!--      <th class="text-center">{{ rightToken }}</th>-->
<!--      <th class="text-center">Aggregator</th>-->
<!--      <th class="text-center">Maker</th>-->
<!--      <th class="text-center">Receiver</th>-->
<!--      <th class="text-center">Actions</th>-->
<!--    </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--    <tr v-if="loading"><td colspan="9"><v-skeleton-loader type="table-tbody" /></td></tr>-->
<!--    <tr v-else-if="!loading && !rows.length"><td colspan="9">No activity</td></tr>-->
<!--    <tr v-for="(item, idx) in rows" :key="idx"-->
<!--        :class="{'buy': item.type === 'buy', 'sell': item.type === 'sell'}" >-->
<!--      <td>{{ item.parsedDate }}</td>-->
<!--      <td class="text-uppercase">{{ item.type }}</td>-->
<!--      <td>{{ priceFormatter(item.parsedPrice) }}</td>-->
<!--      <td>{{ priceFormatter(item.amount_token0) }}</td>-->
<!--      <td>{{ priceFormatter(item.amount_token1) }}</td>-->
<!--      <td>-->
<!--        <a v-if="item.router.address" :href="`https://bscscan.com/address/${item.router.address}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ item.router.title }}</a>-->
<!--        <span v-else>{{ item.router.title }}</span>-->
<!--      </td>-->
<!--      <td><a :href="`https://bscscan.com/address/${item.maker}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.maker) }}</a></td>-->
<!--      <td><a :href="`https://bscscan.com/address/${item.receiver}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.receiver) }}</a></td>-->
<!--      <td><a :href="`https://bscscan.com/tx/${item.tx}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">Show Tx</a></td>-->
<!--    </tr>-->
<!--    <tr v-if="rows.length && rows.length < 1000">-->
<!--      <td colspan="9">-->
<!--        <div v-intersect="infiniteScrolling" class="text-center">-->
<!--          <v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" />-->
<!--        </div>-->
<!--      </td>-->
<!--    </tr>-->
<!--    </tbody>-->
<!--  </v-simple-table>-->
</template>

<script>
import { mapGetters } from "vuex";
import { priceFormatter } from "@/helpers/common";
import store from "@/store";

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  name: "TableHistory",
  data() {return {
    loading: false,
  }},
  async created() {},
  computed: {
    ...mapGetters('chart', ['activeSymbol', 'leftToken', 'rightToken', 'lastTXs', 'exchangesList']),
    rows() {
      // const items = Object.assign([], this.lastTXs)
      // const items = [...this.lastTXs]
      return this.lastTXs.map(item => {
        item.parsedPrice = priceFormatter(+item.amount_token1/+item.amount_token0)
        item.parsedDate = new Date((item.date + this.tzOffset) * 1000).toISOString().slice(0, 19).split('T').join(' ')
        item.router = this.exchangesList.hasOwnProperty(item.router_id) ? this.exchangesList[item.router_id] : { title: '—', address: null }
        // console.log(item.parsedDate)
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
      await this.$store.dispatch('chart/loadHistoryTable', { pair_id: newVal.pair_id })
      this.loading = false
    }
  },
  methods: {
    infiniteScrolling(entries, observer, isIntersecting) {
      if (entries[0].isIntersecting) {
        console.log('Load Oldest TXs on Scroll...')
        store.dispatch('chart/loadOldTXs').then()
      }
    },
    priceFormatter(num) { return priceFormatter(num) }
  }
}
</script>

<style>
.txsTable {
  height: 700px;
}

.vue-recycle-scroller__item-wrapper { /* table */
  min-width: 1200px;
}
.vue-recycle-scroller__slot { /* thead tr */
  display: flex;
  padding: 6px 12px;
  background: #2d3244;
  font-weight: bold;
  margin-bottom: 10px;
}
.vue-recycle-scroller__item-view { /* tbody tr */
  display: flex;
  padding: 3px 12px;
}
.txsTableTd { /* td */
  flex: 1;
  white-space: nowrap;
  text-align: center;
}

</style>