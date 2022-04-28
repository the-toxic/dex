<template>
  <v-app :class="{'pageReady': isRouterReady}">
    <v-navigation-drawer app v-model="drawer" v-if="$vuetify.breakpoint.smAndDown" style="z-index: 7"><!-- v-if="$vuetify.breakpoint.width <= 768" -->
      <v-list>
        <v-list-item :to="{name: 'Home'}">
          <v-list-item-icon><v-icon color="grey">mdi-menu-open</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Main</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item :to="{name: 'Pairs'}">
          <v-list-item-icon><v-icon color="grey">mdi-menu-open</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Pairs</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="showWalletDialog(true)">
          <v-list-item-icon left>
            <v-icon v-if="!!wallet" color="green" alt="Wallet connected">mdi-wallet</v-icon>
            <v-icon v-else alt="Wallet disconnected">mdi-wallet</v-icon>
          </v-list-item-icon>
          <v-list-item-content><v-list-item-title>Wallet</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>


    <v-app-bar app clipped-left :hide-on-scroll="false && $vuetify.breakpoint.mdAndUp" class="mx-auto mb-8">
      <v-container fluid class="pa-0 fill-height">

        <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
          <div class="v-toolbar__title logoBox" @click="navigate">
            <img src="@/assets/logo.svg" alt="HAZB Logo" />
          </div>
        </router-link>

        <v-spacer />

        <v-btn plain :to="{name: 'Home'}" exact :ripple="false" class="d-none d-md-inline-flex" active-class="activeMenu">Main</v-btn>
        <v-btn plain :to="{name: 'NewChart'}" :ripple="false" class="d-none d-md-inline-flex" active-class="activeMenu">Pairs</v-btn>
        <v-btn icon :ripple="false" @click="showWalletDialog(true)" class="d-none d-md-inline-flex">
          <v-icon v-if="!!wallet" color="green" alt="Wallet connected">mdi-wallet</v-icon>
          <v-icon v-else alt="Wallet disconnected">mdi-wallet</v-icon>
        </v-btn>

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
    <v-footer id="mainFooter" absolute bottom padless class="justify-center fill-width pa-0">
      <div class="smallFooter d-flex justify-space-between align-center flex-wrap fill-width">
        <div class="footerCopy text-center grey--text order-1 order-md-0 pl-5">&copy; {{ new Date().getFullYear() }}
          <router-link class="text-decoration-none grey--text" :to="{name: 'Home'}" exact>HAZB</router-link>. All rights reserved.
        </div>
        <v-icon v-if="$route.name === 'Pair'" :color="!wsConnected ? 'red' : (wsConnected === 'loading' ? 'orange' : 'green')">{{ wsConnected ? 'mdi-check-network' : 'mdi-close-network' }}</v-icon>
        <div class="text-center mx-auto mx-md-0 order-0 order-md-1 pt-4 pt-md-0">
          <v-btn tile :href="DOCS_HOST+'/legal/terms-of-use'" target="_blank" rel="nofollow" elevation="0" class="transparent" style="text-transform: none !important;">Terms of Use</v-btn>
          <v-btn tile :href="DOCS_HOST+'/legal/privacy-policy'" target="_blank" rel="nofollow" elevation="0" class="text-capitalize transparent">Privacy Policy</v-btn>
          <v-btn tile :href="DOCS_HOST+'/legal/cookie-policy'" target="_blank" rel="nofollow" elevation="0" class="text-capitalize transparent">Cookie Policy</v-btn>
        </div>
      </div>
    </v-footer>

    <WalletDialog />
    <Alert />

  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import Test from "@/components/testStores.vue";
import WalletDialog from "@/components/WalletDialog.vue";
import Alert from "@/components/Alert.vue";

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
  }
}
</script>