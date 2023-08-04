<template>
  <v-app :class="{'pageReady': isRouterReady}">
    <v-navigation-drawer v-model="drawer" width="500" location="bottom" v-if="breakpoints.mobile"><!-- v-if="breakpoints.width <= 768" -->
      <v-list :nav="true">
        <v-list-item :to="{name: 'Home'}" prepend-icon="mdi-menu-open" title="Landing"></v-list-item>
        <v-list-item :to="{name: 'Console'}" v-if="userStore.logged" prepend-icon="mdi-menu-open" title="Console"></v-list-item>
        <v-list-item :href="NEWS_HOST" target="news" prepend-icon="mdi-menu-open" title="News"></v-list-item>
        <v-list-item :href="DOCS_HOST" target="docs" prepend-icon="mdi-menu-open" title="Docs"></v-list-item>
<!--        <v-list-item :to="{name: 'Career'}" prepend-icon="mdi-menu-open" title="Career"></v-list-item>-->
<!--        <v-list-item :to="{name: 'ContactUs'}" prepend-icon="mdi-menu-open" title="Contact Us"></v-list-item>-->
        <v-list-item :to="{name: 'Profile'}" v-if="userStore.logged" prepend-icon="mdi-menu-open" title="Profile"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-3">
          <v-btn block :to="{name: 'AuthSignIn'}" v-if="!userStore.logged" color="primary" prepend-icon="mdi-login" class="text-none">Sign In</v-btn>
          <v-btn block @click="userStore.logOut()" v-if="userStore.logged" color="primary" prepend-icon="mdi-logout" class="text-none">Log Out</v-btn>
        </div>
      </template>
    </v-navigation-drawer>


    <v-app-bar absolute color="#000">
      <template v-slot:prepend>
        <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
          <div class="logoBox ml-4" @click="navigate">
            <img src="@/assets/logo.png" alt="Logo" />
          </div>
        </router-link>
      </template>

      <v-spacer />
       <v-btn variant="text" size="large" :to="{name: 'Home'}" rounded class="d-none d-md-inline-flex text-none">Home</v-btn>
       <v-btn variant="text" size="large" :to="{name: 'Console'}" v-if="userStore.logged" rounded class="d-none d-md-inline-flex text-none" :class="route.name === 'Pair' ? 'v-btn--active' : ''">Console</v-btn>
       <v-btn variant="text" size="large" :href="NEWS_HOST" target="news" rounded class="d-none d-md-inline-flex text-none">News</v-btn>
       <v-btn variant="text" size="large" :href="DOCS_HOST" target="docs" rounded class="d-none d-md-inline-flex text-none">Docs</v-btn>
<!--       <v-btn variant="flat" :to="{name: 'Career'}" rounded class="d-none d-md-inline-flex text-none">Career</v-btn>-->
<!--       <v-btn variant="flat" :to="{name: 'ContactUs'}" rounded class="d-none d-md-inline-flex text-none">Contact Us</v-btn>-->
      <v-spacer />

      <template v-slot:append>
        <v-btn v-if="route.name === 'Pair'" icon @click="showSearch">
          <v-icon small color="#B3B5BD" class="px-2" alt="Show Search">mdi-magnify</v-icon>
        </v-btn>

        <v-btn v-if="route.name === 'Pair'" icon size="small">
          <v-icon right :color="!mainStore.wsConnected ? 'red' : (mainStore.wsConnected === 'loading' ? 'orange' : 'green')">mdi-checkbox-blank-circle</v-icon>
          <v-tooltip activator="parent" location="bottom">Status: {{ !mainStore.wsConnected ? 'Offline' : (mainStore.wsConnected === 'loading' ? 'Connection' : 'Online') }}</v-tooltip>
        </v-btn>


        <!-- Menu open icon for mobile -->
        <v-app-bar-nav-icon size="small" v-if="breakpoints.mobile" @click.stop="drawer = !drawer" />

        <v-btn :to="{name: 'AuthSignIn'}" v-if="!userStore.logged && !breakpoints.mobile" size="large" rounded class="text-none">Sign In</v-btn>
        <v-btn :to="{name: 'AuthSignUp'}" v-if="!userStore.logged && !breakpoints.mobile" size="large" rounded color="myPurple" variant="flat" class="mx-5 text-none">Sign Up</v-btn>

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


    <v-footer app absolute class="d-flex flex-column text-center text-md-left">

      <div class="d-flex flex-wrap w-100 align-center px-md-4 pb-2">
        <div class="pt-4 fill-width-m">
          <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
            <div class="" @click="navigate">
              <img src="@/assets/logo.png" alt="Logo" />
            </div>
          </router-link>
          <div class="fill-width-m mb-4 mt-4">
            <v-btn icon size="small" variant="tonal" class="mx-2 mx-md-3 ml-md-0" href="https://twitter.com/hazbcom" target="_blank" style="background: #5865f2"><img src="@/assets/social_twitter.svg" width="22" height="22" alt="Twitter" style="filter: brightness(100);" /></v-btn>
            <v-btn icon size="small" variant="tonal" class="mx-2 mx-md-3" style="background: #29a9eb"><img src="@/assets/social_telegram.svg" width="22" height="22" alt="Telegram" style="filter: brightness(100);" /></v-btn>
            <v-btn icon size="small" variant="tonal" class="mx-2 mx-md-3" href="https://linktr.ee/hazbcom" target="_blank" rel="nofollow" style="background: #44e660"><img src="@/assets/social_linktree.png" width="22" height="22" alt="Docs" style="filter: brightness(100);" /></v-btn>
          </div>
        </div>

        <v-spacer class="d-none d-md-block" />

        <v-row class="py-7">
          <v-col cols="12" md="4">
            <p class="fs20 mb-3 font-weight-bold pl-4">Resources</p>
            <v-btn :to="{name: 'Home'}" variant="flat" rounded class="text-none mb-1">Home</v-btn><br />
            <v-btn :href="NEWS_HOST" target="_blank" rel="nofollow" variant="flat" rounded class="text-none mb-1">News</v-btn><br />
            <v-btn :href="DOCS_HOST" target="_blank" rel="nofollow" variant="flat" rounded class="text-none mb-1">Docs</v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <p class="fs20 mb-3 font-weight-bold pl-4">Contacts</p>
            <v-btn href="https://linktr.ee/hazbcom" target="_blank" rel="nofollow" variant="flat" rounded class="text-none">Link Three</v-btn><br />
            <v-btn href="mailto:hello@hazb.com" variant="flat" rounded class="text-none">hello@hazb.com</v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <p class="fs20 mb-3 font-weight-bold pl-4">Console</p>
            <v-btn :to="{name: 'AuthSignIn'}" variant="flat" rounded class="text-none">Sign In</v-btn><br />
            <v-btn :to="{name: 'AuthSignUp'}" variant="flat" rounded class="text-none">Sign Up</v-btn><br />
            <v-btn :to="{name: 'AuthResetPassword'}" variant="flat" rounded class="text-none">Reset Password</v-btn>

          </v-col>
        </v-row>

      </div>
      <v-divider class="fill-width pb-2" />

      <div class="d-flex justify-space-between align-center flex-wrap fill-width px-md-4">
        <div class="text-center text-disabled fs14 order-1 order-md-0 mx-auto mx-md-0 ">
          &copy; {{ new Date().getFullYear() }}
          <router-link class="text-none text-disabled" :to="{name: 'Home'}" exact>{{ PROJECT_NAME }}</router-link>. <span>All Rights Reserved.</span>
        </div>
        <div class="text-center mx-auto mx-md-0 order-0 order-md-1">
          <v-btn variant="flat" rounded :href="DOCS_HOST+'/legal/terms-of-use'" target="_blank" rel="nofollow" class="text-none text-disabled">Terms of Use</v-btn>
          <v-btn variant="flat" rounded :href="DOCS_HOST+'/legal/privacy-policy'" target="_blank" rel="nofollow" class="text-none text-disabled">Privacy Policy</v-btn>
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
  import { PROJECT_NAME, DOCS_HOST, NEWS_HOST } from "@/helpers/mixins";

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

