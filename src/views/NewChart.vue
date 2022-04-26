<template>
  <div>
    <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
      <v-card class="mb-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Network: {{ network }}</span>
          <span>Pair: {{ pairName }}</span>
          <span>Price: {{ '-' }}</span>
        </v-card-title>
        <v-card-text class="fs20 d-flex justify-space-between align-center">
          <span>Exchange: {{ exchange }}</span>
          <span>{{ pairAddr }}</span>
        </v-card-text>
      </v-card>

      <div id="tv_chart_container"></div>

      <v-card class="mt-6 mb-8">
        <TableHistory />
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { initChart } from "@/helpers/chart/chart";
import TableHistory from "@/components/TableHistory";

export default {
  name: "NewChart",
  components: {TableHistory},
  data() { return {
    pairName: '...',
    network: '...',
    exchange: '...',
    pairAddr: ''
  } },
  mounted() {
    initChart()
    // tvWidget.onChartReady(() => {
    //   const symbol = tvWidget.activeChart().symbolExt()
    //   this.pairName = symbol.symbol
    //   this.network = symbol.type
    //   this.exchange = symbol.exchange
    //   this.exchange = symbol.exchange
    //   this.pairAddr = symbol.description
    // });

  },
  // tvWidget.activeChart().symbolExt()
  // Intl.DateTimeFormat().resolvedOptions().timeZone
  // tvWidget.activeChart().setTimezone('Asia/Singapore');
  // tvWidget.activeChart().setSymbol('PanCake v2:TANK/BUSD:0x4e14498c6f679c6421db117bc9e9b08671d42996')
  // tvWidget.activeChart().setResolution('1D');
  // tvWidget.activeChart().executeActionById('symbolSearch'); // показать поиск
  watch: {
    activeSymbol(newVal) {
      this.pairName = newVal.symbol
      this.pairAddr = newVal.pair_addr
      this.exchange = newVal.exchange
      this.network = newVal.type
    }
  },
  computed: {
    ...mapGetters('chart', ['activeSymbol'])
    // pairName() { return '' }
  }
}
</script>
