<template>
  <div class="homeBg text-center fill-height">
    <v-container fluid class="d-flex flex-column align-center justify-center fill-height">
      <h1 class="fs62 fs-m18 font-weight-md-light">HAZB</h1>
      <h3 class="fs35 fs-m18 font-weight-light mt-8">Unlocking On-Chain Insights for Crypto Investors and Teams!</h3>
<!--      <h4 class="fs24 fs-m14 font-weight-medium lh-1_2 mt-4 mx-auto mt-4" style="max-width: 600px">Create unique trading strategies, anticipate market movements, search for big spreads, track and copy the most profitable wallets and much more.</h4>-->
      <v-btn size="x-large" color="primary" class="mt-12" :to="{name: userLogged ? 'Console' : 'AuthSignIn'}" >{{ userLogged ? 'Open pair explorer' : 'Start Now' }}</v-btn>
    </v-container>
  </div>
</template>
<script>
import { PROJECT_NAME } from "@/helpers/mixins";
import { mapState } from "pinia";
import { useUserStore } from "@/store/userStore";

export default {
  name: 'Home',
  // head: { title: {inner: import.meta.env.VITE_APP_PROJECT_NAME, complement: 'Dex Platform'}},
  data: () => ({
    PROJECT_NAME,
  }),
  computed: {
    ...mapState(useUserStore, {userLogged: 'logged'})
  }
}
</script>
