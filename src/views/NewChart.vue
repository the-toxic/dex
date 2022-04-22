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

      <v-card class="mt-6 mb-4">
        <TableHistory />
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { initChart } from "@/helpers/chart/chart";
import TableHistory from "@/components/TableHistory";
export default {
  name: "NewChart",
  components: {TableHistory},
  created() {
  },
  mounted() {
    initChart()
  }
}
</script>
