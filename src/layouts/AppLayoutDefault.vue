<template>
  <v-app :class="{'pageReady': isRouterReady}">
    <v-navigation-drawer v-model="drawer" location="bottom" v-if="breakpoints.mobile"><!-- v-if="breakpoints.width <= 768" -->
      <v-list :nav="true" min-height="300">
        <v-list-item :to="{name: 'Home'}" prepend-icon="mdi-menu-open" title="Landing"></v-list-item>
        <v-list-item :to="{name: 'Console'}" prepend-icon="mdi-menu-open" title="Pairs"></v-list-item>
        <v-list-item :to="{name: 'Analyse'}" prepend-icon="mdi-menu-open" title="Analyse"></v-list-item>
        <v-list-item :to="{name: 'Liquidity'}" prepend-icon="mdi-menu-open" title="Liquidity"></v-list-item>
        <v-list-item :to="{name: 'Profile'}" v-if="userStore.logged" prepend-icon="mdi-menu-open" title="Profile"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="mt-6 pa-3">
          <v-btn :block="true" :to="{name: 'AuthSignIn'}" v-if="!userStore.logged" color="primary" prepend-icon="mdi-login" class="text-none">Log In</v-btn>
          <v-btn :block="true" @click="null" v-else color="primary" prepend-icon="mdi-logout" class="text-none">Log Out</v-btn>
        </div>
      </template>
    </v-navigation-drawer>


    <v-app-bar density="compact" class="mx-auto mb-8">
      <template v-slot:prepend>
        <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
          <div class="logoBox" @click="navigate">
            <img src="@/assets/logo.png" alt="Logo" />
          </div>
        </router-link>
      </template>

      <v-spacer />
      <v-btn variant="flat" :to="{name: 'Console'}" rounded size="small" class="d-none d-md-inline-flex text-none fs14" :class="route.name === 'Pair' ? 'v-btn--active' : ''">Chart</v-btn>
      <v-btn variant="flat" :to="{name: 'Analyse'}" rounded size="small" class="d-none d-md-inline-flex text-none fs14">Analyse</v-btn>
      <v-btn variant="flat" :to="{name: 'Liquidity'}" rounded size="small" class="d-none d-md-inline-flex text-none fs14">Liquidity</v-btn>
      <v-spacer />

      <template v-slot:append>
        <v-btn v-if="route.name === 'Pair'" icon size="small" @click="showSearch">
          <v-icon small color="#B3B5BD" class="px-2" alt="Show Search">mdi-magnify</v-icon>
        </v-btn>

        <v-btn v-if="route.name === 'Pair'" icon size="small">
          <v-icon right size="small" :color="!mainStore.wsConnected ? 'red' : (mainStore.wsConnected === 'loading' ? 'orange' : 'green')">mdi-checkbox-blank-circle</v-icon>
          <v-tooltip activator="parent" location="bottom">Status: {{ !mainStore.wsConnected ? 'Offline' : (mainStore.wsConnected === 'loading' ? 'Connection' : 'Online') }}</v-tooltip>
        </v-btn>


        <!-- Menu open icon for mobile -->
        <v-app-bar-nav-icon size="small" v-if="breakpoints.mobile" @click.stop="drawer = !drawer" />

        <v-btn :to="{name: 'AuthSignIn'}" v-if="!userStore.logged && !breakpoints.mobile" rounded prepend-icon="mdi-login" class="text-none">Sign In</v-btn>

        <v-menu v-if="userStore.logged && !breakpoints.mobile" v-model="userMenu" :close-on-content-click="false" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" rounded append-icon="mdi-menu-down" class="text-none">{{ userStore.user.email }}</v-btn>
          </template>
          <v-card min-width="300">
            <v-list>
              <v-list-item prepend-icon="mdi-badge-account-outline"
                 :title="userStore.user.email" :subtitle="fullName"></v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-item :to="{name: 'Profile'}" title="Profile" prepend-icon="mdi-account" />
              <v-list-item @click="userStore.logOut()" title="Logout" prepend-icon="mdi-logout" />
            </v-list>
          </v-card>
        </v-menu>

        <!-- <v-speed-dial v-if="walletStore.account" v-model="profileBtn" open-on-hover class="d-none d-md-flex" direction="bottom">-->
        <!--   <template v-slot:activator>-->
        <!--     <v-btn v-model="profileBtn" plain class="text-capitalize">{{ shortAddress(walletStore.account) }} <v-icon right small>mdi-arrow-down-drop-circle-outline</v-icon></v-btn>-->
        <!--   </template>-->
        <!--   <p class="mb-2 text-center text-no-wrap">{{ walletStore.providerName }}</p>-->
        <!--   <v-btn small rounded elevation="0" outlined color="error" width="140" @click="disconnect"><v-icon small left>mdi-logout</v-icon>Disconnect</v-btn>-->
        <!-- </v-speed-dial>-->
        <!-- <v-btn v-else @click="connect" icon plain class="d-none d-md-block" height="31"><v-icon>mdi-wallet</v-icon></v-btn>-->
      </template>

      <!-- Loader on redirects -->
      <v-progress-linear :active="mainStore.globalLoader" :indeterminate="true" :absolute="true" top ></v-progress-linear>

    </v-app-bar>

    <v-main class="fill-height">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut"  name="fade" mode="out-in" >
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!--  Футер, прибит вниз через атрибут absolute, inset сдвигает его от фильтра в шопе  -->
    <v-footer :absolute="true" bottom padless class="justify-center fill-width py-1">
      <div class="d-flex justify-space-between align-center flex-wrap fill-width">
        <div class="footerCopy text-center text-disabled fs14 order-1 order-md-0 pl-md-5 mx-auto mx-md-0 py-2 py-md-0">&copy; {{ new Date().getFullYear() }}
          <router-link class="text-none grey--text" :to="{name: 'Home'}" exact>{{ PROJECT_NAME }}</router-link>. <span class="white--text">v0.22</span>
        </div>
        <!--        <v-icon v-if="route.name === 'Pair'" :color="!mainStore.wsConnected ? 'red' : (mainStore.wsConnected === 'loading' ? 'orange' : 'green')">{{ mainStore.wsConnected ? 'mdi-check-network' : 'mdi-close-network' }}</v-icon>-->
        <div class="text-center mx-auto mx-md-0 order-0 order-md-1 pt-2 pt-md-0 pr-md-2">
          <v-btn variant="flat" rounded :to="{name: 'Home'}" class="text-none text-disabled">Landing</v-btn>
          <v-btn variant="flat" rounded target="_blank" rel="nofollow" class="text-none text-disabled">Contacts</v-btn>
          <v-btn variant="flat" rounded :href="DOCS_HOST+'/legal/terms-of-use'" target="_blank" rel="nofollow" class="text-none text-disabled">Legal</v-btn>

          <v-btn icon size="small" variant="flat" class="mr-md-1 ml-md-3" href="https://twitter.com/hazbcom" target="_blank"><img src="@/assets/social_twitter.svg" width="22" height="22" alt="Twitter" /></v-btn>
          <v-btn icon size="small" variant="flat" class="mr-md-1"><img src="@/assets/social_telegram.svg" width="22" height="22" alt="Telegram" /></v-btn>
          <v-btn icon size="small" variant="flat" class="mr-md-1"><img src="@/assets/social_medium.svg" width="22" height="22" alt="Medium" /></v-btn>
          <v-btn icon size="small" variant="flat" class="mr-md-1"><img src="@/assets/social_discord.svg" width="22" height="22" alt="Discord" /></v-btn>
          <v-btn icon size="small" variant="flat" class="mr-md-1" :href="DOCS_HOST" target="_blank" rel="nofollow"><img src="@/assets/paper.svg" width="22" height="22" alt="Docs" /></v-btn>
        </div>
      </div>
    </v-footer>

  </v-app>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { useRoute } from "vue-router";
  import { useTheme, useDisplay } from "vuetify";
  const theme = useTheme()

  import { useMainStore } from "@/store/mainStore";
  import { useUserStore } from "@/store/userStore";
  import { useWalletStore } from "@/store/walletStore";
  import { PROJECT_NAME, DOCS_HOST } from "@/helpers/mixins";

  import { showChartSearch } from "@/helpers/chart/chart";
  // import { connect as web3Connect, disconnect as web3Disconnect } from "@/helpers/web3";

  const mainStore = useMainStore()
  const userStore = useUserStore()
  const walletStore = useWalletStore()
  const route = useRoute()
  const breakpoints = ref(useDisplay())

  const drawer = ref(false)
  const userMenu = ref(false)

  if (mainStore.theme === 'light') {
    toggleTheme()
  }

  const fullName = computed(() => ( userStore.user.first_name || userStore.user.last_name ? `${userStore.user.first_name} ${userStore.user.last_name}` : null ))

  function toggleTheme() {
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
    theme.global.name.value = newTheme
    mainStore.setTheme(newTheme)
  }

  if('msg' in route.query && route.query.msg === 'pair404') {
    setTimeout(() => mainStore.showAlert('Pair not Found'), 500)
  }

  const isRouterReady = computed(() => route.name !== null)

  function showSearch() {
    showChartSearch()
  }
  function connect() {
    drawer.value = false
    // web3Connect().then(success => {
    //   console.log('connect', success)
    // })
  }
  function disconnect() {
    // web3Disconnect()
  }
</script>

