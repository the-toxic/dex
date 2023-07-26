<template>
  <template v-if="step === 'email'">
    <h3 class="fs24 mb-10">Reset Password</h3>

    <v-form v-if="step === 'email'" ref="form" @submit.prevent="onSubmitEmail">
      <v-text-field label="Email"
        v-model.trim="email"
        :rules="emailRules" hint="Enter the email you provided during registration" persistent-hint />

      <div id="captchaBox"></div>

      <v-btn type="submit" color="primary" block size="large" class="myBtn text-none mt-6"
       :loading="loading" :disabled="loading">Send</v-btn>
    </v-form>
  </template>

  <template v-if="step === 'otp'">
    <StepOTP action="reset-password" ref="stepOTP" :email="email" @completed="onCompleteOTP" />
  </template>

  <template v-if="step === 'password'">
    <StepPassword action="reset-password" @completed="onCompletePassword" />
  </template>

</template>

<script>
import VOtpInput from "vue3-otp-input";
import { resetPassword } from "@/api"
import { emailRules } from "@/helpers/mixins";
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";
import StepPassword from "@/components/auth/StepPassword.vue";
import StepOTP from "@/components/auth/StepOTP.vue";

  export default {
    name: 'ResetPassword',
    components: { StepPassword, StepOTP, VOtpInput },
    data() {
      return {
        loading: false,
        step: 'email', // email | otp | password

        email: '',

        CAPTCHA_RESET_PASSWORD_ID: import.meta.env.VITE_APP_CAPTCHA_RESET_PASSWORD_ID
      }
    },
    mounted() {
      const _this = this
      initGeetest4(
        {
          captchaId: _this.CAPTCHA_RESET_PASSWORD_ID,
          product: "bind", // float | bind | popup
          userInfo: _this.email, // optional
          // mask: { bgColor: 'rgba(0,0,0,0.2)' }
        },
        function (captchaObj) {
          captchaObj.appendTo("#captchaBox"); // Insert the validation button into the captchaBox element in the host page
          window.captchaObj = captchaObj
          captchaObj
            .onReady(function () { /*console.log('onReady')*/ })
            .onError(function () { console.log('onError', arguments); _this.showAlert('Captcha error. Please try later...') })
            .onSuccess(function () {
              console.log('onSuccess')
              const captcha = window.captchaObj.getValidate()
              console.log('step', _this.step)
              switch (_this.step) {
                case 'email': _this.sendRequestEmail(captcha); break
                case 'otp': _this.$refs.stepOTP.onCaptchaPassed(captcha); break
              }
            })
        }
      );
    },
    computed: {
      emailRules() { return emailRules },
    },
    methods: {
      ...mapActions(useMainStore, {showAlert: 'showAlert'}),

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
        // this.form.recaptcha_response = token

        this.loading = true
        const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
        // const {data} = await resetPassword(this.form)
        this.loading = false
        window.captchaObj.reset();

        if(data.success) {
          this.step = 'otp'
				}
      },

      onCompleteOTP() {
        this.step = 'password'
      },
      onCompletePassword() {
        this.showAlert({msg: 'Password successfully changed!', color: 'success'})
        this.$router.replace({name: 'AuthSignIn', query: {email: this.email}})
      },
    }
  }
</script>
