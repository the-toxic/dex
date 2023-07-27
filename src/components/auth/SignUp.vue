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
    <StepInvite action="sign-up" ref="stepInvite" :email="email" @completed="onCompleteInvite"/>
  </template>
</template>

<script>
import { emailRules, SOCIAL_DISCORD, SOCIAL_TELEGRAM, SOCIAL_TWITTER } from "@/helpers/mixins";
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
  data: () => ({
		loading: false,
		step: 'email', // email | otp | password | invite

    email: '',

    agree: true,
    CAPTCHA_ID: import.meta.env.VITE_APP_CAPTCHA_ID,
    INVITE_REQUIRED: import.meta.env.VITE_APP_INVITE_REQUIRED === 'true'
	}),
  computed: {
    ...mapStores(useUserStore, useMainStore),
    emailRules() { return emailRules },
  },
  mounted() {
    const _this = this
    initGeetest4(
      {
        captchaId: _this.CAPTCHA_ID, // sign-up event
        product: "bind", // float | bind | popup
      },
      function (captchaObj) {
        // captchaObj.appendTo("#captchaBox"); // Insert the validation button into the captchaBox element in the host page
        window.captchaObj = captchaObj
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
              case 'invite': _this.$refs.stepInvite.onCaptchaPassed(captcha); break
              // case 'otp': !_this.isResendEvent ? _this.sendRequestOTP(captcha) : _this.sendRequestResendEmail(captcha); break
            }
          })
      }
    );
  },
  unmounted() {
    window.captchaObj?.destroy()
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
      this.loading = true
      const { data } = await api.signUp({email: this.email, captcha: captcha})
      this.loading = false
      window.captchaObj.reset();

      if(data.success) {
				this.step = 'otp'
      }
    },

    onCompleteOTP() {
      this.step = 'password'
    },

    async onCompletePassword(userObject) {
      // this.mainStore.showAlert({msg: 'Account successfully created!', color: 'success'})
      if(this.INVITE_REQUIRED) {
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
