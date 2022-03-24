<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" v-if="$vuetify.display.smAndDown"><!-- v-if="$vuetify.display.width <= 768" -->
      <v-list>
        <v-list-item :to="{name: 'Home'}">
          <v-list-item-avatar left><v-icon icon="mdi-menu-open" /></v-list-item-avatar><v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{name: 'Pairs'}">
          <v-list-item-avatar left><v-icon icon="mdi-menu-open" /></v-list-item-avatar><v-list-item-title>Pair</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showWalletDialog(true)">
          <v-list-item-avatar left>
            <v-icon v-if="isLogged" icon="mdi-wallet" color="green" alt="Wallet connected" />
            <v-icon v-else icon="mdi-wallet" alt="Wallet disconnected" />
          </v-list-item-avatar>
          <v-list-item-title>Wallet</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>


    <v-app-bar app ref="appBar" clipped-left :hide-on-scroll="$vuetify.display.mdAndUp" class="mx-auto mb-8" id="mainHeader">

      <!-- Лоадер при редиректах -->
      <v-progress-linear :active="globalLoader" indeterminate id="globalLoader"></v-progress-linear>

      <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
        <v-app-bar-title @click="navigate" class="pointer">HAZB</v-app-bar-title>
        <!-- <div class="v-toolbar__title logoBox" @click="navigate">Dex</div>-->
      </router-link>

      <v-btn plain :to="{name: 'Home'}" :ripple="false" class="d-none d-md-inline-flex" active-class="activeMenu">Home</v-btn>
      <v-btn plain :to="{name: 'Pairs'}" :ripple="false" class="d-none d-md-inline-flex" active-class="activeMenu">Pair</v-btn>
      <v-btn icon="" :ripple="false" @click="showWalletDialog(true)" class="d-none d-md-inline-flex">
        <v-icon v-if="isLogged" icon="mdi-wallet" color="green" alt="Wallet connected" />
        <v-icon v-else icon="mdi-wallet" alt="Wallet disconnected" />
      </v-btn>

      <!-- Гамбургер для мобилки -->
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click.stop="drawer = !drawer" class="ml-3"></v-app-bar-nav-icon>


    </v-app-bar>

    <v-main class="fill-height">
      <v-container fluid class="mx-auto relative">
        <router-view />
<!--          <router-view v-slot="{ Component }">-->
<!--            <transition enter-active-class="fadeIn" leave-active-class="fadeOut"  name="fade" mode="out-in" >-->
<!--              <component :is="Component" />-->
<!--            </transition>-->
<!--          </router-view>-->
      </v-container>
    </v-main>

    <!--  Футер, прибит вниз через атрибут absolute, inset сдвигает его от фильтра в шопе  -->
    <v-footer id="mainFooter" absolute bottom padless color="#1E1E1E" class="justify-center fill-width pa-0">
      <div class="smallFooter d-flex justify-space-between flex-wrap fill-width">
        <div class="footerCopy text-center grey--text order-1 order-md-0 pl-5">&copy; {{ new Date().getFullYear() }}
          <router-link class="text-decoration-none grey--text" :to="{name: 'Home'}" exact>HAZB</router-link>. All rights reserved.
        </div>
        <div>{{ wsConnected ? 'On' : 'Off' }}</div>
        <div class="text-center mx-auto mx-md-0 order-0 order-md-1 pt-4 pt-md-0">
          <v-btn tile :href="DOCS_HOST+'/legal/terms-of-use'" target="_blank" rel="nofollow" elevation="0" class="transparent" style="text-transform: none !important;">Terms of Use</v-btn>
          <v-btn tile :href="DOCS_HOST+'/legal/privacy-policy'" target="_blank" rel="nofollow" elevation="0" class="text-capitalize transparent">Privacy Policy</v-btn>
          <v-btn tile :href="DOCS_HOST+'/legal/cookie-policy'" target="_blank" rel="nofollow" elevation="0" class="text-capitalize transparent">Cookie Policy</v-btn>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
// import Test from "@/components/testStores.vue";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "./stores/main";

export default {
  name: 'App',
  // components: {Test},
  data: () => ({
    drawer: false,
    BLOG_HOST: process.env.VUE_APP_BLOG_HOST,
    DOCS_HOST: process.env.VUE_APP_DOCS_HOST,
  }),
  created() {
  },
  computed: {
    ...mapState(useMainStore, {
      globalLoader: 'globalLoader',
      isLogged: 'wallet.isLogged',
      wsConnected: 'wsConnected'
    })
  },
  methods: {
    ...mapActions(useMainStore, {showWalletDialog: 'showWalletDialog'}),
  }
}
</script>