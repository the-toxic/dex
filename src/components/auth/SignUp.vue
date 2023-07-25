<template>

  <template v-if="step === 'email'">
    <v-form ref="formEmail" @submit.prevent="onSubmitEmail" class="fill-width">
      <h3 class="fs24 mb-10">Sign Up</h3>

      <v-text-field label="Email" filled
        v-model.trim="email"
        :rules="emailRules" />

      <v-checkbox v-model="agree" :rules="[v => !!v || 'Need agree with policy']" density="compact">
        <template v-slot:label>
            <span class="flex-wrap">
              I agree with <a @click.stop target="_blank" :href="'/legal/privacy-policy'" class="text-decoration-underline">Privacy Policy</a>
              & <a @click.stop target="_blank" :href="'/legal/terms-of-use'" class="text-decoration-underline">Terms & Conditions</a>
            </span>
        </template>
      </v-checkbox>

      <v-btn type="submit" color="primary" block class="myBtn mt-2 text-none" size="large"
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
    <h3 class="fs24 mb-10">Enter Code</h3>
    <p class="mb-4">We've sent a code to {{ email }}</p>

    <v-otp-input
      ref="otpInput" v-model:value="otp"
      input-classes="otp-input" separator=""
      :num-inputs="6" :should-auto-focus="true" :is-disabled="otpDisabled"
      input-type="number" :placeholder="['', '', '', '', '', '']"
      @on-change="handleOnChange" @on-complete="handleOnComplete"
    /> <!-- letter-numeric -->
    <v-alert v-if="!otpAttempts" color="error" variant="tonal" density="compact" border icon="mdi-alert" :prominent="true" class="mt-6">
      The code has expired, please resend the email with the new code
    </v-alert>

    <v-btn @click="onSubmitOTP" color="primary" block class="myBtn mt-8 text-none" size="large"
     :loading="loading" :disabled="loading || otp.length !== 6">Next</v-btn>

    <p class="mt-6 text-blue-grey-lighten-3">
      Didn't receive anything?
      <v-btn @click="resendEmail" :loading="loadingResend" :disabled="loadingResend || timer > 0"
        variant="text" color="secondary" class="text-none" :text="`Resend code${timer > 0 ? ` (${timer}s)` : ''}`" />
    </p>
  </template>

  <template v-if="step === 'password'">
    <h3 class="fs24 mb-10">Create Password</h3>
    <v-text-field label="Password" filled
      v-model.trim="password" name="password"
      :type="visiblePassword ? 'text' : 'password'"
      :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visiblePassword = !visiblePassword"
      :rules="passwordRules" />

    <v-text-field label="Repeat Password" filled
      v-model.trim="rePassword" type="password"
      :rules="[(password === rePassword) || 'Password must be match']" />

    <v-btn @click="onSubmitPassword" color="primary" block class="myBtn mt-4 text-none" size="large"
       :loading="loading" :disabled="loading">Next</v-btn>
  </template>

  <template v-if="step === 'invite'"></template>
</template>

<script>
import { emailRules, passwordRules } from "@/helpers/mixins";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";
import VOtpInput from "vue3-otp-input";

export default {
  name: 'SignUp',
  components: { VOtpInput },
  data() {return {
		loading: false,
    loadingResend: false,
		step: 'email', // email | otp | password | invite

    email: 'test@test.com',
    password: '',
    otp: '',
    invite: '',
    recaptcha_response: '',

    agree: true,
    timer: 0,
    timerId: null,
    otpAttempts: 3,
    otpDisabled: false,
		rePassword: '',
		visiblePassword: false
	}},
  computed: {
    ...mapStores(useUserStore, useMainStore),
    emailRules() { return emailRules },
    passwordRules() { return passwordRules },
  },
  unmounted() {
    clearInterval(this.timerId)
  },
  methods: {
    async onSubmitEmail() {
      const { valid } = await this.$refs.formEmail.validate()
      console.log(valid)
      if(!valid) return false

      // if(import.meta.env.VITE_APP_RECAPTCHA_ENABLE_SIGN_UP === 'true') {
      //   await this.recaptchaHandler('sign-up', this.sendRequestEmail) // callback sendRequestEmail(token)
      // } else {
        await this.sendRequestEmail('')
      // }
    },
    async sendRequestEmail(token) {
      this.recaptcha_response = token
      this.loading = true
      const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
      // const data = await this.userStore.signUp({email: this.email, recaptcha_response: this.recaptcha_response})
      this.loading = false

      if(data.success) {
				this.step = 'otp'
      }
    },

    async onSubmitOTP() {
      // if(import.meta.env.VITE_APP_RECAPTCHA_ENABLE_SIGN_UP_OTP === 'true') {
      //   await this.recaptchaHandler('sign-up', this.sendRequestOTP)
      // } else {
      await this.sendRequestOTP('')
      // }
    },
    async sendRequestOTP(token) {
      if(this.otpAttempts <= 0) return
      this.recaptcha_response = token
      this.loading = true
      const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
      // const data = await this.userStore.signUpOTP({email: this.otp, recaptcha_response: this.recaptcha_response})
      this.loading = false

      if(data.success) {
        this.step = 'password'
      } else {
        this.otpAttempts = this.otpAttempts - 1
        if(this.otpAttempts <= 0) {
          this.otpDisabled = true
        } else {
          this.mainStore.showAlert('Incorrect code')
        }
        this.$refs.otpInput?.clearInput()
      }
    },

		async resendEmail() {
      this.otpAttempts = 3
      this.otpDisabled = false

			this.loadingResend = true
      const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
			// const data = await this.userStore.resendConfirmEmail(this.email)
			this.loadingResend = false

      this.timer = 10
      this.timerId = setInterval(() => {
        this.timer = this.timer - 1
        if(this.timer <= 0) clearInterval(this.timerId)
      }, 1000)

      if(data.success) {
      }
		},

    async onSubmitPassword() {

    },

    handleOnComplete (value) {},
    handleOnChange (value) {},

// const clearInput = () => { this.$refs.otpInput.value?.clearInput() }
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
