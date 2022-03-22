<template>
  <v-app>
    <v-main>
      <v-container>
        <img alt="Vue logo" src="./assets/logo.png" />
        <Chart />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Chart from './components/Chart.vue'

export default {
  name: 'App',
  components: {Chart},
  data: () => ({
    //
  }),
}
</script>