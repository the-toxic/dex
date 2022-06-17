<template>
  <v-app :class="{'pageReady': isRouterReady}">
    <v-navigation-drawer app v-model="drawer" v-if="$vuetify.breakpoint.smAndDown" style="z-index: 7"><!-- v-if="$vuetify.breakpoint.width <= 768" -->
      <v-list>
        <v-list-item :to="{name: 'Home'}">
          <v-list-item-icon><v-icon color="grey">mdi-menu-open</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Landing</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item :to="{name: 'Pairs'}">
          <v-list-item-icon><v-icon color="grey">mdi-menu-open</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Chart</v-list-item-title></v-list-item-content>
        </v-list-item>
        <!--<v-list-item @click="showWalletDialog(true)">-->
        <!--  <v-list-item-icon left>-->
        <!--    <v-icon v-if="!!wallet" color="green" alt="Wallet connected">mdi-wallet</v-icon>-->
        <!--    <v-icon v-else alt="Wallet disconnected">mdi-wallet</v-icon>-->
        <!--  </v-list-item-icon>-->
        <!--  <v-list-item-content><v-list-item-title>Wallet</v-list-item-title></v-list-item-content>-->
        <!--</v-list-item>-->
      </v-list>
    </v-navigation-drawer>


    <v-app-bar app clipped-left height="39" :hide-on-scroll="false && $vuetify.breakpoint.mdAndUp" class="mx-auto mb-8">
      <v-container fluid class="pa-0 fill-height">

        <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
          <div class="v-toolbar__title logoBox" @click="navigate">
            <img src="@/assets/logo.png" alt="Logo" />
          </div>
        </router-link>

        <v-spacer />

        <v-btn plain :to="{name: 'Pairs'}" small exact :ripple="false" class="d-none d-md-inline-flex text-capitalize fs14" :class="$route.name === 'Pair' ? 'v-btn--active' : ''">Chart</v-btn>
        <v-btn plain :to="{name: 'Analyse'}" small :ripple="false" class="d-none d-md-inline-flex text-capitalize fs14">Analyse</v-btn>
        <v-btn plain :to="{name: 'Liquidity'}" small :ripple="false" class="d-none d-md-inline-flex text-capitalize fs14">Liquidity</v-btn>

        <v-spacer />

        <!--<v-btn icon :ripple="false" @click="showWalletDialog(true)" class="d-none d-md-inline-flex">-->
        <!--  <v-icon v-if="!!wallet" color="green" alt="Wallet connected">mdi-wallet</v-icon>-->
        <!--  <v-icon v-else alt="Wallet disconnected">mdi-wallet</v-icon>-->
        <!--</v-btn>-->

        <v-btn v-if="$route.name === 'Pair'" icon small :ripple="false" @click="showSearch">
          <v-icon small color="#B3B5BD" class="px-2" alt="Show Search">mdi-magnify</v-icon>
        </v-btn>
        <v-icon right small v-if="$route.name === 'Pair'" :color="!wsConnected ? 'red' : (wsConnected === 'loading' ? 'orange' : 'green')">mdi-checkbox-blank-circle</v-icon>


        <!-- Menu open icon for mobile -->
        <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click.stop="drawer = !drawer" class="ml-3"></v-app-bar-nav-icon>

        <!-- Loader on redirects -->
        <v-progress-linear :active="globalLoader" indeterminate absolute top ></v-progress-linear>

      </v-container>
    </v-app-bar>

    <v-main class="fill-height mb-9">
      <transition enter-active-class="fadeIn" leave-active-class="fadeOut"  name="fade" mode="out-in" >
        <router-view />
      </transition>
    </v-main>

    <!--  Футер, прибит вниз через атрибут absolute, inset сдвигает его от фильтра в шопе  -->
    <v-footer absolute bottom padless class="justify-center fill-width py-1">
      <div class="smallFooter d-flex justify-space-between align-center flex-wrap fill-width">
        <div class="footerCopy fs12 text-center grey--text order-1 order-md-0 pl-md-5 mx-auto mx-md-0 py-2 py-md-0">&copy; {{ new Date().getFullYear() }}
          <router-link class="text-decoration-none grey--text" :to="{name: 'Home'}" exact>{{ PROJECT_NAME }}</router-link>. <span class="white--text">v0.12</span>
        </div>
<!--        <v-icon v-if="$route.name === 'Pair'" :color="!wsConnected ? 'red' : (wsConnected === 'loading' ? 'orange' : 'green')">{{ wsConnected ? 'mdi-check-network' : 'mdi-close-network' }}</v-icon>-->
        <div class="text-center mx-auto mx-md-0 order-0 order-md-1 pt-2 pt-md-0 pr-md-2">
          <v-btn tile small :to="{name: 'Home'}" elevation="0" class="transparent" style="text-transform: none !important; color: #72747F">Landing</v-btn>
          <v-btn tile small target="_blank" rel="nofollow" elevation="0" class="transparent" style="text-transform: none !important; color: #72747F">Contacts</v-btn>
          <v-btn tile small :href="DOCS_HOST+'/legal/terms-of-use'" target="_blank" rel="nofollow" elevation="0" class="transparent" style="text-transform: none !important; color: #72747F">Legal</v-btn>

          <v-btn icon small :ripple="false" class="mr-md-1 ml-md-3" href="https://twitter.com/hazbcom" target="_blank"><img src="@/assets/social_twitter.svg" width="22" height="22" alt="Twitter" /></v-btn>
          <v-btn icon small :ripple="false" class="mr-md-1"><img src="@/assets/social_telegram.svg" width="22" height="22" alt="Telegram" /></v-btn>
          <v-btn icon small :ripple="false" class="mr-md-1"><img src="@/assets/social_medium.svg" width="22" height="22" alt="Medium" /></v-btn>
          <v-btn icon small :ripple="false" class="mr-md-1"><img src="@/assets/social_discord.svg" width="22" height="22" alt="Discord" /></v-btn>
          <v-btn icon small :ripple="false" class="mr-md-1" :href="DOCS_HOST" target="_blank" rel="nofollow"><img src="@/assets/paper.svg" width="22" height="22" alt="Docs" /></v-btn>
        </div>
      </div>
    </v-footer>

    <WalletDialog />
    <Alert />

  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import WalletDialog from "@/components/WalletDialog.vue";
import Alert from "@/components/Alert.vue";
import { showChartSearch } from "@/helpers/chart/chart";

export default {
  name: 'App',
  components: {Alert, WalletDialog},
  // components: {Test},
  data: () => ({
    drawer: false,
    BLOG_HOST: process.env.VUE_APP_BLOG_HOST,
    DOCS_HOST: process.env.VUE_APP_DOCS_HOST,
  }),
  created() {
    if('msg' in this.$route.query && this.$route.query.msg === 'pair404') {
      setTimeout(() => this.$store.dispatch('showAlert', 'Pair not Found'), 500)
    }
  },
  computed: {
    isRouterReady() { return this.$route.name !== null },
    ...mapGetters([
      'globalLoader',
      'wallet',
      'wsConnected'
    ])
  },
  methods: {
    ...mapActions({showWalletDialog: 'showWalletDialog'}),
    showSearch() {
      showChartSearch()
    }
  }
}
</script>