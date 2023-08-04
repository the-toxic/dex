<template>
  <div class="blueGradient">
    <v-container tag="section" fluid class="firstScreen relative text-center">
      <div class="homeBg"></div>
      <div class="relative d-flex flex-column justify-center align-center fill-height mx-auto" style="max-width: 1200px">
        <h1 class="fs62 font-weight-md-light">Unlocking On-Chain Insights!</h1>
        <div class="fs35 fs-m18 font-weight-light mt-8" style="text-shadow: #3F51B5 1px 1px 20px;">
          <p>Diverse deep into blockchain data to make informed decisions, identify trends, and drive success in the fast-paced crypto world.</p>
          <p>Empower your investments and team strategies with powerful analytics.</p>
        </div>
        <v-btn size="x-large" color="white" variant="outlined" class="fs-m14 mt-12" :to="{name: userLogged ? 'Console' : 'AuthSignIn'}" >{{ userLogged ? 'Open pair explorer' : 'Join us on this data-driven journey!' }}</v-btn>
      </div>
    </v-container>

    <v-container tag="section" fluid class="mb-32">
      <v-row class="text-center">
        <v-col cols="12" md="6" class="px-md-16 mb-md-10">
          <v-icon icon="mdi-numeric-1-box-outline" class="fs60 fs-m40" />
          <h3 class="fs30 fs-m25 lh-1_2 mb-8 mt-6">Gain invaluable intelligence that matter most to you.</h3>
          <p class="fs20 fs-m14 lh-1_2 font-weight-light">Gain invaluable intelligence on addresses, entities, or assets that matter most to you. Empower your crypto investigations and decision-making with a comprehensive, user-friendly platform. Unleash the power of data-driven insights to optimize your strategies and stay on top of the game!</p>
        </v-col>
        <v-col cols="12" md="6" class="px-md-16 mb-md-10">
          <v-icon icon="mdi-numeric-2-box-outline" class="fs60 fs-m40" />
          <h3 class="fs30 fs-m25 lh-1_2 mb-8 mt-6">Unveil the Movers and Shakers of Blockchain Activity!</h3>
          <p class="fs20 fs-m14 lh-1_2 font-weight-light">Unlock the true potential of blockchain analytics and gain unparalleled insights into the people and companies shaping the digital revolution. Empower your crypto journey with data-driven knowledge! </p>
        </v-col>
        <v-col cols="12" md="6" class="px-md-16 mb-md-10">
          <v-icon icon="mdi-numeric-3-box-outline" class="fs60 fs-m40" />
          <h3 class="fs30 fs-m25 lh-1_2 mb-8 mt-6">Tailor Your Alerts for On-Chain Activity!</h3>
          <p class="fs20 fs-m14 lh-1_2 font-weight-light">Personalize your notifications to stay on top of critical blockchain events and transactions. Be in the know, make timely decisions, and optimize your crypto ventures. Embrace the power of customization and stay ahead in the world of blockchain insights! </p>
        </v-col>
        <v-col cols="12" md="6" class="px-md-16 mb-md-10">
          <v-icon icon="mdi-numeric-4-box-outline" class="fs60 fs-m40" />
          <h3 class="fs30 fs-m25 lh-1_2 mb-8 mt-6">Dive into Professionally Researched Insights</h3>
          <p class="fs20 fs-m14 lh-1_2 font-weight-light">Unlock the power of data-driven analysis for the crypto world. Stay ahead with comprehensive and reliable research, making better-informed decisions. Embrace the future of blockchain intelligence today! </p>
        </v-col>
      </v-row>
    </v-container>

    <v-container tag="section" fluid class="text-center" style="background: rgb(24 35 46 / 80%)">
      <div class="mb-24 mt-24">
        <h2 class="fs40 fs-m25">Elevate Your Game with Blockchain Analytics!</h2>
        <p class="fs24 fs-m16 mx-auto mt-10" style="max-width: 1000px">Gain Transparency, Identify Opportunities, and Enhance Decision-Making. Embrace the Power of Analytics and Elevate Your Crypto Journey Now!</p>
        <v-btn size="x-large" color="white" variant="outlined" class="fs-m14 mt-12" :to="{name: userLogged ? 'Console' : 'AuthSignIn'}" >{{ userLogged ? 'Open pair explorer' : 'Start Now' }}</v-btn>
      </div>
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
