<template>
  <div ref="chart"></div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';
import { mapStores, mapState } from "pinia";
import { useMainStore } from "../stores/main";
import { closeWs, startCandles } from "../api";

export default {
  name: 'Chart',
  props: {
    pairId: Number,
    span: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      chart: null,
      chartSeries: null,
      // timerId: null
    }
  },

  mounted() {
    this.chart = createChart(this.$refs.chart, { width: this.$refs.chart.clientWidth, height: 600 });
    // this.chart.timeScale().fitContent() // fill on wrap width
    // this.chart.timeScale().resetTimeScale();
    // chart.removeSeries(series);
    // chart.timeScale().scrollToRealTime();
    this.chart.timeScale().applyOptions({timeVisible: true,})
    this.chart.applyOptions({
      layout: {
        background: {
          color: '#171a25',
          // type: ColorType.VerticalGradient,
          // topColor: '#000',
          // bottomColor: '#444',
        },
        textColor: '#a2a5ae',
        // fontSize: 20,
        // fontFamily: 'Calibri',
      },
      grid: {
        vertLines: {
          color: '#242632',
          style: 1,
          visible: true,
        },
        horzLines: {
          color: '#242632',
          style: 1,
          visible: true,
        },
      }
    })
    // const chartSeries = this.chart.addLineSeries();
    this.chartSeries = this.chart.addCandlestickSeries({
      // title: 'Pair name',
    });

    this.chartSeries.applyOptions({
      priceFormat: {
        type: 'custom',
        minMove: '0.00000001',
        // precision: 6,
        formatter: (price) => {
          // console.log(price)
          if (price < 0.001) return parseFloat(price).toFixed(8)
          else if (price >= 0.001 && price < 1) return parseFloat(price).toFixed(6)
          else return parseFloat(price).toFixed(2)
        },
        // minMove: '0.000001',
        // formatter: (price) => {
        //   if (price < 0.000001) return parseFloat(price).toPrecision(8)
        //   else if (price >= 0.000001 && price < 1) return parseFloat(price).toPrecision(6)
        //   else return parseFloat(price).toPrecision(6)
        // },
        priceScale: {
          autoScale: true
        },
        // localization: {
        //   locale: 'en-US',
        //   priceFormatter: (price) => {
        //     if (price < 0.000001) return parseFloat(price).toPrecision(8)
        //     else if (price >= 0.000001 && price < 1) return parseFloat(price).toPrecision(6)
        //     else return parseFloat(price).toPrecision(6)
        //   }
        // },
      }
    })

    // console.log(this.chart.timeScale().options())
    // const candles = this.mainStore.candles
    // const currentDate = new Date(candles[candles.length - 1].time);
    // let lastData = candles[candles.length - 1]

    // this.chartSeries.setData(candles)

    // this.mainStore.$subscribe((mutation, state) => {
    //   console.log('$subscribe', mutation.events)
    //   // if(mutation.events.key === 'candles') {
    //   //   this.chartSeries.update(state.candles)
    //   // }
    // })

    this.openWs()

    // console.log(this.chart.timeScale().getVisibleRange())

    // this.timerId = setInterval(() => {
    //   currentDate.setDate(currentDate.getDate() + 1);
    //   const trendUp = Math.random() > 0.5 ? 1.5 : -1.5
    //   const next = {
    //     time: currentDate.toISOString().slice(0, 10),
    //     open: lastData.close,
    //     high: lastData.close + trendUp * Math.random(),
    //     low: lastData.close - trendUp * Math.random(),
    //     close: lastData.close + trendUp * Math.random(),
    //   };
    //   lastData = next
    //   this.chartSeries.update(next);
    // }, 1000);

    window.addEventListener('resize', this.handleResize);

  },
  unmounted() {
    // clearInterval(this.timerId)
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    pairId() {
      closeWs()
      this.openWs()
    },
    span() {
      console.log('span')
      closeWs()
      this.openWs()
    }
  },
  computed: {
    ...mapStores(useMainStore)
  },
  methods: {
    openWs() {
      const date = new Date();
      const tomorrowTimestamp = +date.setDate(date.getDate() - 10).toString().slice(0, -3);

      startCandles(this.pairId, this.span, tomorrowTimestamp, (candles) => {
        this.chartSeries.setData([])
        // candles = candles.map((i) => ({
        //   high: Math.round(i.high),
        //   low: Math.round(i.low),
        //   close: Math.round(i.close),
        //   open: Math.round(i.open),
        //   time: i.time,
        // }))
        if(candles.length > 1) {
          this.chartSeries.setData(candles)
        } else {
          this.chartSeries.update(candles[0])
        }

        this.$emit('priceUpdate', candles[candles.length - 1].close)

        // setTimeout(() => {
        //   this.chartSeries.update({
        //     close: 297059703789.18665,
        //     high: 307059703789.18665,
        //     low: 28191674226.06323,
        //     open: 285232884152.4325,
        //     time: 1648288860,
        //   })
        // }, 2000)
      })
    },
    handleResize() {
      this.chart.applyOptions({ width: this.$refs.chart.clientWidth });
    },
  }
}

// defineProps({
//   msg: String
// })
</script>
