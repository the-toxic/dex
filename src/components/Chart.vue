<template>
  <h1>{{ msg }}</h1>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>

  <div ref="chart" style="width: 800px; margin: auto"></div>


</template>

<script>
import { createChart } from 'lightweight-charts';

export default {
  name: 'Chart',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    const chart = createChart(this.$refs.chart, { width: 800, height: 500 });
    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
      { time: '2019-04-11', value: 80.01 },
      { time: '2019-04-12', value: 96.63 },
      { time: '2019-04-13', value: 76.64 },
      { time: '2019-04-14', value: 81.89 },
      { time: '2019-04-15', value: 74.43 },
      { time: '2019-04-16', value: 80.01 },
      { time: '2019-04-17', value: 96.63 },
      { time: '2019-04-18', value: 76.64 },
      { time: '2019-04-19', value: 81.89 },
      { time: '2019-04-20', value: 74.43 },
    ]);
  }
}
// import { ref } from 'vue'
// import { createChart } from 'lightweight-charts';


// defineProps({
//   msg: String
// })

// const count = ref(0)
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
