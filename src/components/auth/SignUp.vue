<template>
  <template v-if="step === 'email'">
    <v-form ref="formEmail" @submit.prevent="onSubmitEmail" class="fill-width">
      <h3 class="fs24 mb-10">Sign Up</h3>

      <v-text-field label="Email"
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
    <StepOTP action="sign-up" ref="stepOTP" :email="email" @completed="onCompleteOTP" />
  </template>

  <template v-if="step === 'password'">
    <StepPassword action="sign-up" @completed="onCompletePassword" />
  </template>

  <template v-if="step === 'invite'">
    <h3 class="fs24 mb-6">Whitelist</h3>
    <p class="fs16 mb-4">Thank you for registration!</p>
    <p class="fs16 mb-6">Follow us:
      <v-btn icon variant="tonal" color="black" :href="SOCIAL_TWITTER" class="ml-2"><v-img width="30" height="30" src="@/assets/social_twitter.svg" /></v-btn>
      <v-btn icon variant="tonal" color="black" :href="SOCIAL_TELEGRAM" class="ml-2"><v-img width="30" height="30" src="@/assets/social_telegram.svg" class="mr-1" /></v-btn>
      <v-btn icon variant="tonal" color="black" :href="SOCIAL_DISCORD" class="ml-2"><v-img width="30" height="30" src="@/assets/social_discord.svg" /></v-btn>
    </p>
    <p class="fs16 text-blue mb-2">If you have invite code you can continue</p>
    <v-form ref="formInvite" @submit.prevent="onSubmitInvite" class="fill-width">
      <v-text-field label="Invite code" v-model.trim="invite"
        :rules="[v => v.length === 6 || 'Incorrect length']" />

      <v-btn type="submit" color="primary" block class="myBtn mt-2 text-none" size="large"
       :loading="loading" :disabled="loading">Next</v-btn>

      <v-divider class="mt-4" />
      <v-btn :to="{name: 'Home'}" variant="outlined" color="secondary" class="mt-6 text-none">Back to Home</v-btn>
    </v-form>
  </template>
</template>

<script>
import { emailRules, SOCIAL_DISCORD, SOCIAL_TELEGRAM, SOCIAL_TWITTER } from "@/helpers/mixins";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";
import VOtpInput from "vue3-otp-input";
import StepOTP from "@/components/auth/StepOTP.vue";
import StepPassword from "@/components/auth/StepPassword.vue";

export default {
  name: 'SignUp',
  components: { StepPassword, StepOTP, VOtpInput },
  data: () => ({
		loading: false,
		step: 'email', // email | otp | password | invite

    email: '',
    invite: '',

    agree: true,
    SOCIAL_TWITTER, SOCIAL_TELEGRAM, SOCIAL_DISCORD,
    CAPTCHA_SIGN_UP_ID: import.meta.env.VITE_APP_CAPTCHA_SIGN_UP_ID
	}),
  computed: {
    ...mapStores(useUserStore, useMainStore),
    emailRules() { return emailRules },
  },
  mounted() {
    const _this = this
    initGeetest4(
      {
        captchaId: _this.CAPTCHA_SIGN_UP_ID, // sign-up event
        product: "bind", // float | bind | popup
      },
      function (captchaObj) {
        // captchaObj.appendTo("#captchaBox"); // Insert the validation button into the captchaBox element in the host page
        window.captchaObj = captchaObj
        // window.captchaObj.showCaptcha()
        // window.captchaObj.showBox()
        // window.captchaObj.getValidate()
        captchaObj
          .onReady(() => { /*console.log('onReady')*/ })
          .onError(function () { console.log('onError', arguments); _this.showAlert('Captcha error. Please try later...') })
          .onSuccess(function () {
            // console.log('onSuccess')
            const captcha = window.captchaObj.getValidate()
            console.log('step', _this.step)
            switch (_this.step) {
              case 'email': _this.sendRequestEmail(captcha); break
              case 'otp': _this.$refs.stepOTP.onCaptchaPassed(captcha); break
              case 'invite': _this.sendRequestInvite(captcha); break
              // case 'otp': !_this.isResendEvent ? _this.sendRequestOTP(captcha) : _this.sendRequestResendEmail(captcha); break
            }
          })
      }
    );
  },
  unmounted() {
    window.captchaObj.destroy()
  },
  methods: {
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
      // this.recaptcha_response = token
      this.loading = true
      const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
      // const data = await this.userStore.signUp({email: this.email, recaptcha_response: this.recaptcha_response})
      this.loading = false
      window.captchaObj.reset();

      if(data.success) {
				this.step = 'otp'
      }
    },

    onCompleteOTP() {
      this.step = 'password'
    },

    async onCompletePassword() {
      this.step = 'invite'
    },

    async onSubmitInvite() {
      const { valid } = await this.$refs.formInvite.validate()
      if(!valid) return false

      if(import.meta.env.VITE_APP_CAPTCHA_SIGN_UP === 'true') {
        window.captchaObj.showCaptcha()
        //   await this.recaptchaHandler('sign-up', this.sendRequestInvite)
      } else {
        await this.sendRequestInvite({})
      }
    },
    async sendRequestInvite(captcha) {
      this.loading = true
      const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
      // const data = await this.userStore.resendConfirmEmail(this.email)
      this.loading = false
      window.captchaObj.reset();

      if(data.success) {
        this.mainStore.showAlert({msg: 'Account successfully created!', color: 'success'})
        this.$router.replace({name: 'AuthSignIn', query: {email: this.email}})
      }
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
