<template>
  <template v-if="step === 'email'">
<!--    <img src="/assets/landing/svg/logo.svg" class="mb-6 mt-2" alt="Logo">-->
    <h3 class="fs24 mb-8">Reset Password</h3>

    <v-form v-if="step === 'email'" ref="form" @submit.prevent="onSubmitEmail">
      <v-text-field label="Email"
        v-model.trim="email"
        :rules="emailRules" hint="Enter the email you provided during registration" persistent-hint />

      <v-btn type="submit" color="primary" block size="large" class="myBtn text-none mt-6"
       :loading="loading" :disabled="loading">Send</v-btn>
    </v-form>
  </template>

  <template v-if="step === 'otp'">
    <StepOTP action="reset-password" ref="stepOTP" :email="email" :attempts="attempts" :initial-timer="timer" @completed="onCompleteOTP" />
  </template>

  <template v-if="step === 'password'">
    <StepPassword action="reset-password" :email="email" :otp="otp" @completed="onCompletePassword" />
  </template>

</template>

<script>
	import * as api from "@/api"
	import { emailRules } from "@/helpers/mixins";
	import { mapActions } from "pinia";
	import { useMainStore } from "@/store/mainStore";
	import StepPassword from "@/components/auth/StepPassword.vue";
	import StepOTP from "@/components/auth/StepOTP.vue";

  export default {
    name: 'ResetPassword',
    components: { StepPassword, StepOTP },
    head: { title: 'Reset Password'},
		expose: ['onSuccessCaptcha'], // call this method from parent component
    data() {
      return {
        loading: false,
        step: 'email', // email | otp | password

        email: '',
        attempts: 0,
        otp: '',
        timer: 0,
      }
    },
    computed: {
      emailRules() { return emailRules },
    },
    methods: {
      ...mapActions(useMainStore, {showAlert: 'showAlert'}),

			onSuccessCaptcha(captcha) {
				console.log('onSuccessCaptcha')
				console.log('step', this.step)
				switch (this.step) {
					case 'email': this.sendRequestEmail(captcha); break
					case 'otp': this.$refs.stepOTP.onCaptchaPassed(captcha); break
				}
			},
      async onSubmitEmail() {
        const { valid } = await this.$refs.form.validate()
        if(!valid) return false

        if(import.meta.env.VITE_APP_CAPTCHA_RESET_PASSWORD === 'true') {
          window.captchaObj.showCaptcha()
        //   await this.recaptchaHandler('password-recovery', this.sendRequest) // callback sendRequest(token)
        } else {
          await this.sendRequestEmail({})
        }
      },
      async sendRequestEmail(captcha) {
        this.loading = true
        const {data} = await api.resetPassword({email: this.email, captcha})
        this.loading = false
        window.captchaObj.reset();

        if(data.success) {
          this.attempts = data.result?.attempts || 0
          this.timer = data.result?.timeout || 180
          this.step = 'otp'
				}
      },

      onCompleteOTP(otp) {
        this.otp = otp
        this.step = 'password'
      },

      onCompletePassword() {
        this.showAlert({msg: 'Password successfully changed!', color: 'success'})
        this.$router.replace({name: 'AuthSignIn', query: {email: this.email}})
      },
    }
  }
</script>
