<template>
  <v-app :class="{'pageReady': isRouterReady}">
    <v-navigation-drawer v-model="drawer" width="500" location="bottom" v-if="breakpoints.mobile"><!-- v-if="breakpoints.width <= 768" -->
      <v-list :nav="true">
        <v-list-item :to="{name: 'Home'}" prepend-icon="mdi-menu-open" title="Landing"></v-list-item>
        <v-list-item :to="{name: 'Pairs', params: {network: 'ethereum'}}" v-if="userStore.logged" prepend-icon="mdi-menu-open" title="Explorer"></v-list-item>
        <v-list-item :to="{name: 'BigSwaps', params: {network: 'bsc'}}" v-if="userStore.logged" prepend-icon="mdi-menu-open" title="BigSwaps"></v-list-item>
        <v-list-item :to="{name: 'PrivateLabels'}" v-if="userStore.logged" prepend-icon="mdi-menu-open" title="Private Labels"></v-list-item>
        <v-list-item :to="{name: 'SC'}" v-if="userStore.logged" prepend-icon="mdi-menu-open" title="SC"></v-list-item>
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

    <v-app-bar absolute>
			<!-- LEFT Side-->
			<template v-slot:prepend>
        <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
          <div class="logoBox ml-4 mr-8" @click="navigate">
            <img src="@/assets/logo.png" alt="Logo" />
          </div>
        </router-link>
      </template>

<!--      <v-spacer />-->

			<!-- Center Side-->
			<v-btn variant="text" :active="false" size="large" :to="{name: 'Home'}" rounded class="d-none d-md-inline-flex text-none">Home</v-btn>
			<v-btn variant="text" :active="false" size="large" :to="{name: 'Dashboard'}" rounded class="d-none d-md-inline-flex text-none">Dashboard</v-btn>
			<v-menu v-if="userStore.logged" v-model="consoleSubMenu" :close-on-content-click="false" location="bottom">
				<template v-slot:activator="{ props }">
						<v-btn v-bind="props" variant="text" :active="false" size="large" append-icon="mdi-menu-down" rounded class="d-none d-md-inline-flex text-none">DEX</v-btn>
				</template>
				<v-list>
					<v-list-item title="Explorer" :to="{name: 'Pairs', params: {network: 'ethereum'}}" />
					<v-list-item title="Big Swaps" :to="{name: 'BigSwaps', params: {network: 'bsc'}}" />
					<v-list-item title="SC" :to="{name: 'SC'}" />
				</v-list>
			</v-menu>

			<v-spacer />

			<!-- Right Side-->
      <template v-slot:append>
        <v-btn v-if="userStore.logged" @click="showSearch" rounded variant="text" class="text-body-2">
          <v-icon color="#B3B5BD" class="pr-4" alt="Show Search">mdi-magnify</v-icon>
          Search
          <span class="py-0 px-2 ml-3 border rounded text-disabled text-caption">⌘ K</span>
        </v-btn>

        <!-- Menu open icon for mobile -->
        <v-app-bar-nav-icon size="small" v-if="breakpoints.mobile" @click.stop="drawer = !drawer" />

				<template v-if="!breakpoints.mobile">
					<v-btn :to="{name: 'AuthSignIn'}" v-if="!userStore.logged" size="large" rounded class="text-none">Sign In</v-btn>
					<v-btn :to="{name: 'AuthSignUp'}" v-if="!userStore.logged" size="large" color="white" variant="outlined" class="mx-5 text-none">Sign Up <v-icon icon="mdi-arrow-right" color="white" class="pl-2" /></v-btn>

					<v-btn :to="{name: 'PrivateLabels'}" v-if="userStore.logged" rounded class="text-none">Private Labels</v-btn>
					<v-btn :to="{name: 'Segments'}" v-if="userStore.logged" rounded class="text-none">Segments</v-btn>
					<v-btn :to="{name: 'WatchList'}" v-if="userStore.logged" rounded class="text-none">Watch List</v-btn>

          <v-btn v-if="route.name === 'Pair'" icon size="small">
            <v-icon right :color="!mainStore.wsConnected ? 'red' : (mainStore.wsConnected === 'loading' ? 'orange' : 'green')">mdi-checkbox-blank-circle</v-icon>
            <v-tooltip activator="parent" location="bottom">Status: {{ !mainStore.wsConnected ? 'Offline' : (mainStore.wsConnected === 'loading' ? 'Connection' : 'Online') }}</v-tooltip>
          </v-btn>

					<v-menu v-model="docsSubMenu" :close-on-content-click="false" location="bottom">
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" icon="mdi-text-box-outline" title="Docs"></v-btn>
						</template>
						<v-list width="100">
							<v-list-item :href="DOCS_HOST" target="docs">Docs <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-list-item>
							<v-list-item :href="NEWS_HOST" target="docs">News <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-list-item>
							<v-list-item title="Support" href="mailto:support@hazb.com" />
						</v-list>
					</v-menu>

					<v-menu v-if="userStore.logged" v-model="userSubMenu" :close-on-content-click="false" location="bottom">
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" icon="mdi-account" title="Account"></v-btn>
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
				</template>

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


    <v-footer app absolute :color="$route.path.startsWith('/console') ? null : '#000'" class="d-flex flex-column text-center text-md-left">

      <!-- <div class="d-flex flex-wrap w-100 align-center px-md-4 pb-2">
        <div class="pt-4 fill-width-m">
          <router-link custom v-slot="{ navigate }" :to="{name: 'Home'}">
            <div class="" @click="navigate">
              <img src="@/assets/HAZB.svg" style="height: 28px" alt="Logo" />
            </div>
          </router-link>
          <div class="fill-width-m mb-4 mt-4">
            <v-btn icon size="small" variant="tonal" class="mx-2 mx-md-3 ml-md-0" :href="SOCIAL_TWITTER" target="_blank" rel="nofollow" style="background: #5865f2"><img src="@/assets/social_twitter.svg" width="22" height="22" alt="Twitter" style="filter: brightness(100);" /></v-btn>
            <v-btn icon size="small" variant="tonal" class="mx-2 mx-md-3" :href="SOCIAL_TELEGRAM" target="_blank" rel="nofollow" style="background: #29a9eb"><img src="@/assets/social_telegram.svg" width="22" height="22" alt="Telegram" style="filter: brightness(100);" /></v-btn>
            <v-btn icon size="small" variant="tonal" class="mx-2 mx-md-3" :href="SOCIAL_LINKTREE" target="_blank" rel="nofollow" style="background: #44e660"><img src="@/assets/social_linktree.png" width="22" height="22" alt="Docs" style="filter: brightness(100);" /></v-btn>
          </div>
        </div>

        <v-spacer class="d-none d-md-block" />

        <v-row class="py-7">
          <v-col cols="12" md="4">
            <p class="fs20 mb-3 font-weight-bold pl-4">Resources</p>
            <v-btn :to="{name: 'Home'}" variant="text" :active="false" rounded class="text-none mb-1">Home</v-btn><br />
            <v-btn :href="NEWS_HOST" target="_blank" rel="nofollow" variant="text" rounded class="text-none mb-1">News <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn><br />
            <v-btn :href="DOCS_HOST" target="_blank" rel="nofollow" variant="text" rounded class="text-none mb-1">Docs <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <p class="fs20 mb-3 font-weight-bold pl-4">Contacts</p>
            <v-btn href="https://linktr.ee/hazbcom" target="_blank" rel="nofollow" variant="text" rounded class="text-none">Link Three <v-icon icon="mdi-open-in-new" size="x-small" class="mb-3" /></v-btn><br />
            <v-btn href="mailto:hello@hazb.com" variant="text" rounded class="text-none">hello@hazb.com</v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <p class="fs20 mb-3 font-weight-bold pl-4">Console</p>
            <v-btn :to="{name: 'Console'}" v-if="userStore.logged" variant="text" :active="false" rounded class="text-none">DEX</v-btn>
            <v-btn :to="{name: 'AuthSignIn'}" v-if="!userStore.logged" variant="text" rounded class="text-none">Sign In</v-btn><br />
            <v-btn :to="{name: 'AuthSignUp'}" v-if="!userStore.logged" variant="text" rounded class="text-none">Sign Up</v-btn><br />
            <v-btn :to="{name: 'AuthResetPassword'}" v-if="!userStore.logged" variant="text" rounded class="text-none">Reset Password</v-btn>
          </v-col>
        </v-row>
      </div>-->
      <!-- <v-divider class="fill-width pb-2" />-->

      <div class="d-flex justify-space-between align-center flex-wrap fill-width px-md-4">
        <div class="text-center text-disabled fs14 order-1 order-md-0 mx-auto mx-md-0 ">
          &copy; {{ new Date().getFullYear() }}
          <router-link class="text-none text-disabled" :to="{name: 'Home'}" exact>{{ PROJECT_NAME }}</router-link>. <span>All Rights Reserved.</span>
        </div>
        <div class="text-center mx-auto mx-md-0 order-0 order-md-1">
          <!-- <v-btn variant="text" rounded :href="DOCS_HOST+'/legal/terms-of-use'" target="_blank" rel="nofollow" class="text-none text-disabled">Terms of Use</v-btn>
          <v-btn variant="text" rounded :href="DOCS_HOST+'/legal/privacy-policy'" target="_blank" rel="nofollow" class="text-none text-disabled">Privacy Policy</v-btn>-->
        </div>
      </div>
    </v-footer>

		<SearchDialog />

  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
  import { useRoute } from "vue-router";
  import { useTheme, useDisplay } from "vuetify";
  const theme = useTheme()

  import { useMainStore } from "@/store/mainStore";
  import { useUserStore } from "@/store/userStore";
  import { useWalletStore } from "@/store/walletStore";
  import { PROJECT_NAME, DOCS_HOST, NEWS_HOST, SOCIAL_TWITTER, SOCIAL_TELEGRAM, SOCIAL_LINKTREE } from "@/helpers/mixins";

  // import { showChartSearch } from "@/helpers/chart/chart";
	import SearchDialog from "@/components/SearchDialog.vue";
  // import { connect as web3Connect, disconnect as web3Disconnect } from "@/helpers/web3";

  const mainStore = useMainStore()
  const userStore = useUserStore()
  const walletStore = useWalletStore()
  const route = useRoute()
  const breakpoints = ref(useDisplay())

  const drawer = ref(false)
  const userSubMenu = ref(false)
  const consoleSubMenu = ref(false)
  const docsSubMenu = ref(false)

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
    mainStore.searchDialog = true
  }

  onMounted(() => {
    window.addEventListener('keydown', searchShortCutHandler)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', searchShortCutHandler)
  })

  function searchShortCutHandler(event) {
    if ((event.metaKey || event.ctrlKey) && event.code === 'KeyK') { // event.key === '/' ; event.code === 'Slash'
      event.preventDefault()
      showSearch()
    }
  }
  // function connect() {
  //   drawer.value = false
  //   // web3Connect().then(success => {
  //   //   console.log('connect', success)
  //   // })
  // }
  // function disconnect() {
  //   // web3Disconnect()
  // }
</script>

