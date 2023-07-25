<template>
  <div class="d-flex flex-column justify-md-center align-center fill-height pa-6 pa-md-10 pa-xl-16 ">
    <div class="text-md-left text-center">
      <v-btn-toggle mandatory variant="tonal" color="secondary" class="rounded-lg">
        <v-btn :to="{name: 'AuthSignIn'}" class="fs20 px-md-12 px-8 text-none">Sign In</v-btn>
        <v-btn :to="{name: 'AuthSignUp'}" class="fs20 px-md-12 px-8 text-none">Sign Up</v-btn>
      </v-btn-toggle>
    </div>
    <component :is="pageComponent" />
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
