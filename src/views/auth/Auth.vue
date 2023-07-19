<template>
  <v-row class="no-gutters fill-height">
    <v-col md="6" cols="12" class="d-none d-md-block primary darken-4 overflow-hidden relative">
			<div class="authLeftBg"></div>
    </v-col>
    <v-col md="6" cols="12">
			<div class="d-flex flex-column justify-md-center align-center fill-height pa-6 pa-md-10 pa-xl-16 ">
				<div class="text-md-left text-center mb-8">
					<v-btn-toggle mandatory class="rounded-lg">
						<v-btn :to="{name: 'AuthSignIn'}" height="60" class="fs20 px-md-12 px-8 text-capitalize">Login</v-btn>
						<v-btn :to="{name: 'AuthSignUp'}" height="60" class="fs20 px-md-12 px-8 text-capitalize">Sign Up</v-btn>
					</v-btn-toggle>
				</div>
				<component :is="pageComponent" />
			</div>
    </v-col>
  </v-row>
</template>

<script>
import AuthSignUp from "@/components/auth/SignUp";
import AuthSignIn from "@/components/auth/SignIn"
import AuthResetPassword from "@/components/auth/ResetPassword"
// import AuthEmailConfirm from "@/views/auth/AuthEmailConfirm"
import AuthSetNewPassword from "@/views/auth/AuthSetNewPassword";

export default {
  name: "Auth",
  components: {AuthSetNewPassword, AuthSignUp, AuthSignIn, AuthResetPassword/*, AuthEmailConfirm*/},
  head: {title: {inner: 'Auth'}},
  data() {return {
		pageComponent: 'AuthSignUp',
	}},
	beforeRouteEnter(to, from, next) {
		next(vm => vm.$store.getters['user/logged'] ? vm.$router.replace({name: 'Pairs'}) : true)
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
