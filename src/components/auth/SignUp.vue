<template>
  <template v-if="step === 'email'">
    <v-form ref="formEmail" @submit.prevent="onSubmitEmail" class="fill-width">
<!--      <img src="/assets/landing/svg/logo.svg" class="mb-6 mt-2" alt="Logo">-->
      <h3 class="fs24 mb-8">Sign Up</h3>

      <v-text-field label="Email"
        v-model.trim="email"
        :rules="emailRules" hide-details="auto" class="text-left mb-4" />

      <v-checkbox v-model="agree" :rules="[v => !!v || 'Need agree with policy']" density="compact" hide-details="auto" class="text-left">
        <template v-slot:label>
            <span class="flex-wrap">
              I agree with <a @click.stop target="_blank" :href="'/legal/privacy-policy'" class="text-decoration-underline">Privacy Policy</a>
              & <a @click.stop target="_blank" :href="'/legal/terms-of-use'" class="text-decoration-underline">Terms & Conditions</a>
            </span>
        </template>
      </v-checkbox>

      <v-btn type="submit" color="primary" block class="myBtn mt-4 text-none" size="large"
       :loading="loading" :disabled="loading">Sign Up</v-btn>

      <p class="mt-6 text-blue-grey-lighten-3">
        Already have an account?
        <v-btn variant="text" :to="{name: 'AuthSignIn'}" color="secondary" class="text-none">Sign In</v-btn>
      </p>
      <v-divider class="mt-4" />
      <v-btn :to="{name: 'Home'}" variant="outlined" color="secondary" class="mt-6 text-none">Back to Home</v-btn>
    </v-form>
  </template>

  <template v-if="step === 'otp'">
    <StepOTP action="sign-up" ref="stepOTP" :email="email" :attempts="attempts" :initial-timer="timer" @completed="onCompleteOTP" />
  </template>

  <template v-if="step === 'password'">
    <StepPassword action="sign-up" :email="email" :otp="otp" @completed="onCompletePassword" />
  </template>

  <template v-if="step === 'invite'">
    <StepInvite action="sign-up" ref="stepInvite" :email="email" @completed="onCompleteInvite"/>
  </template>
</template>

<script>
import { emailRules } from "@/helpers/mixins";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";
import StepOTP from "@/components/auth/StepOTP.vue";
import StepPassword from "@/components/auth/StepPassword.vue";
import * as api from "@/api";
import StepInvite from "@/components/auth/StepInvite.vue";

export default {
  name: 'SignUp',
  components: { StepInvite, StepPassword, StepOTP },
  head: { title: 'Sign Up' },
	expose: ['onSuccessCaptcha'], // call this method from parent component

  data: () => ({
		loading: false,
		step: 'email', // email | otp | password | invite

    email: '',
    attempts: 0, // OTP count attempts
    otp: '',
    timer: 0,

    agree: true,
	}),

	computed: {
    ...mapStores(useUserStore, useMainStore),
    emailRules() { return emailRules },
  },

  methods: {
		onSuccessCaptcha(captcha) {
			console.log('onSuccessCaptcha')
			console.log('step', this.step)
			switch (this.step) {
				case 'email': this.sendRequestEmail(captcha); break
				case 'otp': this.$refs.stepOTP.onCaptchaPassed(captcha); break
				case 'invite': this.$refs.stepInvite.onCaptchaPassed(captcha); break
				// case 'otp': !_this.isResendEvent ? _this.sendRequestOTP(captcha) : _this.sendRequestResendEmail(captcha); break
			}
		},

    async onSubmitEmail() {
      const { valid } = await this.$refs.formEmail.validate()
      if(!valid) return false

      if(import.meta.env.VITE_APP_CAPTCHA_SIGN_UP === 'true') {
        window.captchaObj.showCaptcha()
      //   await this.recaptchaHandler('sign-up', this.sendRequestEmail)
      } else {
        await this.sendRequestEmail({})
      }
    },
    async sendRequestEmail(captcha) {
      this.loading = true
      const { data } = await api.signUp({email: this.email, captcha: captcha})
      this.loading = false
      window.captchaObj.reset();

      if(data.success) {
        this.attempts = data.result?.attempts || 3
        this.timer = data.result?.timeout || 180
				this.step = 'otp'
      }
    },

    onCompleteOTP(otp) {
      this.otp = otp
      this.step = 'password'
    },

    async onCompletePassword(userObject = null) {
      // this.mainStore.showAlert({msg: 'Account successfully created!', color: 'success'})
      if(!userObject) {
        this.step = 'invite'
      } else {
        this.userStore.logIn(userObject)
        this.$router.replace({name: 'Console'})
      }
    },

    async onCompleteInvite(userObject) {
      console.log('onCompleteInvite', userObject)
      this.userStore.logIn(userObject)
      this.$router.replace({name: 'Console'})
    },

		// async onSubmitEmail() {
		// 	const { valid } = await this.$refs.formEmail.validate()
		// 	if(!valid) return false
		// 	if(!this.sign_phrase && !await requestSign()) return false
		// 	this.loading = true
		// 	const data = await createGarageAccount(this.form)
		// 	if(data.success) {
		// 		this.$store.commit('garage/setAccountExists', true)
		// 		await this.$store.dispatch('showAlert', {msg: 'Account successfully created', color: 'success'})
		// 		this.$router.push({name: 'GarageAccount'}).then()
		// 	}
		// 	this.loading = false
		// },
  }
}
</script>
