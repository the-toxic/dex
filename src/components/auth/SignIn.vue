<template>
  <template v-if="step === 'default'">
<!--    <img src="/assets/landing/svg/logo.svg" class="d-md-none mb-6 mt-2" alt="Logo">-->
    <h3 class="fs24 mb-8">Sign In</h3>
    <v-form ref="form" @submit.prevent="onSubmitEmail">
      <v-text-field label="Email"
        v-model.trim="form.email"
        :rules="emailRules" class="mb-1" />

      <v-text-field label="Password"
        v-model.trim="form.password"
        name="password" type="password" hide-details="auto"
        :rules="passwordRules" class="mb-2" />

      <v-checkbox v-model="form.remember" label="Remember me" :true-value="true" :false-value="false" density="compact" hide-details />

      <v-btn type="submit" color="primary" block class="myBtn mt-2 text-none" size="large"
       :loading="loading" :disabled="loading">Login</v-btn>

      <div class="d-flex justify-space-between align-center mt-8">
        <v-btn variant="text" :to="{name: 'AuthResetPassword'}" color="secondary" class="text-none mx-n4">Reset Password</v-btn>
        <v-btn :to="{name: 'Home'}" variant="outlined" color="secondary" class="text-none">Back to Home</v-btn>
      </div>
    </v-form>
  </template>

  <template v-if="step === 'need_invite'">
    <StepInvite action="sign-in" ref="stepInvite" :email="form.email" @completed="onCompleteInvite"/>
  </template>

</template>

<script>
import { emailRules, passwordRules } from "@/helpers/mixins";
import { mapActions } from "pinia";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";
import * as api from "@/api";
import StepInvite from "@/components/auth/StepInvite.vue";
import { fetchChains } from "@/api";

export default {
	name: 'SignIn',
	head: { title: 'Sign In' },
	components: { StepInvite },
	expose: ['onSuccessCaptcha'], // call this method from parent component
	data() {
		return {
			loading: false,
			step: 'default', // default | need_invite
			form: {
				email: '',
				password: '',
				remember: false,
			},
			CAPTCHA_SIGN_IN: import.meta.env.VITE_APP_CAPTCHA_SIGN_IN === 'true',
		}
	},
	created() {
		const { email } = this.$route.query
		if(email) this.form.email = email
	},
	computed: {
		emailRules() { return emailRules },
		passwordRules() { return passwordRules },
	},
	methods: {
		...mapActions(useUserStore, {logIn: 'logIn'}),
		...mapActions(useMainStore, {showAlert: 'showAlert', setChains: 'setChains'}),

		async onSubmitEmail() {
			const { valid } = await this.$refs.form.validate()
			if(!valid) return false

			if(this.CAPTCHA_SIGN_IN) {
				window.captchaObj.showCaptcha()
			} else {
				await this.trySignIn({})
			}
		},

		onSuccessCaptcha(captcha) {
			console.log('onSuccessCaptcha')
			console.log('step', this.step)
			switch (this.step) {
				case 'default': this.trySignIn(captcha); break
				case 'need_invite': this.$refs.stepInvite.onCaptchaPassed(captcha); break
			}
		},

		async trySignIn(captcha) {
			this.form.captcha = captcha

			this.loading = true
			const data = await api.signIn(this.form)
			this.loading = false
			window.captchaObj.reset();

			if(data.success) {
				if(data.result?.invite_code_required) {
					this.step = 'need_invite'
				} else {
					this.logIn(data.result)
					this.loadChains().then()
					await this.$router.replace({name: 'Console'})
				}
			}
		},

		async onCompleteInvite(userObject) {
			this.logIn(userObject)
			this.loadChains().then()
			this.$router.replace({name: 'Console'})
		},

		async loadChains () {
			const data = await fetchChains()
			if(data.success) {
				this.setChains(data.result)
			}
		}
	}
}
</script>
