<template>
  <div class="text-center fill-width" style="max-width: 500px">
    <v-btn-toggle mandatory variant="tonal" color="secondary" class="rounded-lg mb-8">
      <v-btn :to="{name: 'AuthSignIn'}" class="px-md-12 px-8 text-none">Sign In</v-btn>
      <v-btn :to="{name: 'AuthSignUp'}" class="px-md-12 px-8 text-none">Sign Up</v-btn>
    </v-btn-toggle>

    <v-card rounded class="rounded-xl" elevation="0">
      <v-card-text class="pa-6 px-md-12 py-md-14">
        <component :is="pageComponent" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import AuthSignUp from "@/components/auth/SignUp.vue";
import AuthSignIn from "@/components/auth/SignIn.vue"
import AuthResetPassword from "@/components/auth/ResetPassword.vue"
// import AuthEmailConfirm from "@/views/auth/AuthEmailConfirm.vue"
import AuthSetNewPassword from "@/views/auth/AuthSetNewPassword.vue";
import { useUserStore } from "@/store/userStore";
const userStore = useUserStore()

export default {
  name: "Auth",
  components: {AuthSetNewPassword, AuthSignUp, AuthSignIn, AuthResetPassword/*, AuthEmailConfirm*/},
  head: {title: {inner: 'Auth'}},
  data() {return {
		pageComponent: 'AuthSignUp',
	}},
	beforeRouteEnter(to, from, next) {
		next(vm => userStore.logged ? vm.$router.replace({name: 'Pairs'}) : true)
	},
  watch: {
    '$route.name'(routeName) {
      if(!routeName) return
			this.pageComponent = routeName
    }
  },
  created() {
    this.pageComponent = this.$route.name
		// this.$store.commit('paddingContainer', false)

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
