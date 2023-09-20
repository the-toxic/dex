<template>
	<div id="tv_chart_container" class="fill-height fill-width"></div>
</template>

<script>
import { initChart } from "@/helpers/chart/chart";
import { mapActions, mapState } from "pinia";
import { useChartStore } from "@/store/chartStore";

export default {
  name: "ChartTV",
	props: {
		pairAddr: String
	},

  mounted() {
    initChart(this.pairAddr)
    // tvWidget.onChartReady(() => {
    //   const symbol = tvWidget.activeChart().symbolExt()
    //   this.pairName = symbol.symbol
    //   this.network = symbol.type
    //   this.exchange = symbol.exchange
    //   this.exchange = symbol.exchange
    //   this.pairAddr = symbol.description
    // });

  },
  destroyed() {
    window.tvWidget.remove()
    this.resetState()
  },
  // tvWidget.activeChart().symbolExt()
  // Intl.DateTimeFormat().resolvedOptions().timeZone
  // tvWidget.activeChart().setTimezone('Asia/Singapore');
  // tvWidget.activeChart().setSymbol('PanCake v2:TANK/BUSD:0x4e14498c6f679c6421db117bc9e9b08671d42996')
  // tvWidget.activeChart().setResolution('1D');
  // tvWidget.activeChart().executeActionById('symbolSearch'); // показать поиск
  watch: {
    // '$route.params'(to, from) {
    //   this.title = `${this.pairName} - ${this.lastPrice}`
    //   this.$emit('updateHead') // update title
    // },
    // async activeSymbol(newVal, oldVal) {
    //   if(!newVal) return // on resetState
      // console.log('activeSymbol change', newVal, oldVal)
    // },
  },
  // computed: {
  //   ...mapState(useChartStore, ['activeSymbol']),
  // },
  methods: {
    ...mapActions(useChartStore, {resetState: 'resetState'}),
  }
}
</script>
