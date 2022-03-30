<template>
  <div class="homeBg text-center fill-height">
    <div class="py-16">
      <v-container fluid class="mx-auto relative" style="max-width: 1500px">
        <h1 class="text-h2">BOOST YOUR EXCHANGE EXPERIENCE</h1>
        <h3 class="text-h4 mt-16">Real-time data analysis at the tips of your fingers:</h3>
        <h4 class="text-h5 mt-4 mx-auto" style="max-width: 600px">Create unique trading strategies, anticipate market movements, search for big spreads, track and copy the most profitable wallets and much more.</h4>
        <div class="mt-12">
          <v-btn x-large color="primary" :to="{name: 'Pairs'}">Open pair explorer</v-btn>
        </div>
        <p class="mt-16 fs20">If you are a DEFI user, and you want to be able to anticipate market movements and develop better trading strategies, HAZB will help you in a very simple way.</p>
      </v-container>
    </div>
    <v-container fluid class="mx-auto relative" style="max-width: 1500px">
      <v-card>
        <v-card-text>
          <div class="row pa-3 pa-md-5">
            <div class="col-6 col-md-4 py-2">
              <v-icon x-large>mdi-responsive</v-icon>
              <div class="mt-5">
                <h4 class="text-h5">RESPONSIVE</h4>
                <p class="text-muted text-h6">HAZB works on any device: desktop, tablet or mobile.</p>
              </div>
            </div>
            <div class="col-6 col-md-4 py-2">
              <v-icon x-large>mdi-cursor-default-click-outline</v-icon>
              <div class="mt-5">
                <h4 class="text-h5">SUBSCRIPTIONS</h4>
                <p class="text-muted text-h6">Purchase DEXT via exchanges to enable DEXT subscriptions.</p>
              </div>
            </div>
            <div class="col-6 col-md-4 py-2">
              <v-icon x-large>mdi-harddisk</v-icon>
              <div class="mt-5">
                <h4 class="text-h5">STORE YOUR DATA</h4>
                <p class="text-muted text-h6">Save your data and access it from any device.</p>
              </div>
            </div>
            <div class="col-6 col-md-4 py-2">
              <v-icon x-large>mdi-bell-badge-outline</v-icon>
              <div class="mt-5">
                <h4 class="text-h5">NOTIFICATIONS</h4>
                <p class="text-muted text-h6">Set-up your live notifications.</p>
              </div>
            </div>
            <div class="col-6 col-md-4 py-2">
              <v-icon x-large>mdi-robot-happy-outline</v-icon>
              <div class="mt-5">
                <h4 class="text-h5">BOTS</h4>
                <p class="text-muted text-h6">Create unique trading strategies for maximum profitability.</p>
              </div>
            </div>
            <div class="col-6 col-md-4 py-2">
              <v-icon x-large>mdi-chart-areaspline</v-icon>
              <div class="mt-5">
                <h4 class="text-h5">STATS</h4>
                <p class="text-muted text-h6">Check and watch real time the best DEFI Statistics.</p>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'Home',
  head: { title: {inner: 'HAZB', complement: 'Dex Platform'}},
}
</script>