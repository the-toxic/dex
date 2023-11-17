<template>
  <v-container fluid class="authBg d-flex align-center justify-center" style="height: 100vh">

    <router-link :to="{name: 'Home'}" class="authLogo">
      <img src="/assets/landing/svg/logo.svg" alt="Logo">
    </router-link>

    <div class="text-center fill-width" style="max-width: 500px">

      <v-card rounded color="myBlack" class="rounded-xl" elevation="0">
        <v-card-text class="pa-6 px-md-12 py-md-14">

          <v-btn-toggle mandatory variant="tonal" class="d-flex rounded-lg mb-8">
            <v-btn :to="{name: 'AuthSignIn'}" class="flex-fill px-md-12 px-8 text-none">Sign In</v-btn>
            <v-btn :to="{name: 'AuthSignUp'}" class="flex-fill px-md-12 px-8 text-none">Sign Up</v-btn>
          </v-btn-toggle>

          <component :is="pageComponent" />
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import AuthSignUp from "@/components/auth/SignUp.vue";
import AuthSignIn from "@/components/auth/SignIn.vue"
import AuthResetPassword from "@/components/auth/ResetPassword.vue"
import { useUserStore } from "@/store/userStore";
const userStore = useUserStore()

export default {
  name: "Auth",
  components: {AuthSignUp, AuthSignIn, AuthResetPassword},
  data() {return {
		pageComponent: 'AuthSignUp',
	}},
	beforeRouteEnter(to, from, next) {
		next(vm => userStore.logged ? vm.$router.replace({name: 'Console'}) : true)
	},
  watch: {
    '$route.name'(routeName) {
      if(!routeName) return
			this.pageComponent = routeName
    }
  },
  created() {
    this.pageComponent = this.$route.name

    // this.$recaptchaLoaded().then(_ => {
    //   console.log('loaded')
    //   // this.$recaptchaInstance.hideBadge()
    // })
	},
	destroyed() {
		// this.$store.commit('paddingContainer', true)
	},
}
</script>
