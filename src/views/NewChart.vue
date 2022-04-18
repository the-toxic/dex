<template>
  <div>
    <v-container fluid class="mx-auto relative" style="max-width: 1500px;height: 100%">
      <v-card class="mb-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Network: {{ '-' }}</span>
          <span>Pair: {{ '-' }}</span>
          <span>Price: {{ '-' }}</span>
        </v-card-title>
        <v-card-text class="fs20">Pair contract: {{ '-' }}</v-card-text>
      </v-card>
      <div id="tv_chart_container"></div>
    </v-container>
  </div>
</template>

<script>
import { initChart } from "@/helpers/chart/chart";
export default {
  name: "NewChart",
  created() {
  },
  mounted() {
    initChart()
  }
}
</script>
