<template>
  <template v-if="step === 'email'">
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

      <div id="captchaBox"></div>

      <v-btn type="submit" color="primary" block class="myBtn mt-2 text-none" size="large"
       :loading="loading" :disabled="loading">Login</v-btn>

      <div class="d-flex justify-space-between align-center mt-8">
        <v-btn variant="text" :to="{name: 'AuthResetPassword'}" color="secondary" class="text-none mx-n4">Reset Password</v-btn>
        <v-btn :to="{name: 'Home'}" variant="outlined" color="secondary" class="text-none">Back to Home</v-btn>
      </div>
    </v-form>
  </template>
  <template v-if="step === 'invite'">
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
    components: { StepInvite },
    head: { title: 'Sign In' },
    data() {
      return {
        loading: false,
        step: 'email', // email | invite
        form: {
          email: '',
          password: '',
          remember: false,
        },
        CAPTCHA_ID: import.meta.env.VITE_APP_CAPTCHA_ID,
        CAPTCHA_SIGN_IN: import.meta.env.VITE_APP_CAPTCHA_SIGN_IN === 'true',
      }
    },
    created() {
      const { email } = this.$route.query
      if(email) this.form.email = email
    },
    mounted() {
      const _this = this
      initGeetest4(
        {
          captchaId: _this.CAPTCHA_ID,
          product: "bind", // float | bind | popup
          userInfo: _this.form.email, // optional
          // mask: { bgColor: 'rgba(0,0,0,0.2)' }
        },
        function (captchaObj) {
          captchaObj.appendTo("#captchaBox"); // Insert the validation button into the captchaBox element in the host page
          window.captchaObj = captchaObj
          captchaObj
            .onReady(function () { /* console.log('onReady')*/ })
            .onError(function () { console.log('onError', arguments); _this.showAlert('Captcha error. Please try later...') })
            .onSuccess(function () {
              const captcha = window.captchaObj.getValidate()
              console.log('step', _this.step)
              switch (_this.step) {
                case 'email': _this.sendRequestEmail(captcha); break
                case 'invite': _this.$refs.stepInvite.onCaptchaPassed(captcha); break
              }
            })
        }
      );
    },
    unmounted() {
      window.captchaObj?.destroy()
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
          await this.sendRequestEmail({})
        }
      },
      async sendRequestEmail(captcha) {
        this.form.captcha = captcha

        this.loading = true
        const { data } = await api.signIn(this.form)
        this.loading = false
        window.captchaObj.reset();

        if(data.success) {
          if(data.result?.invite_code_required) {
            this.step = 'invite'
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
        const { data } = await fetchChains()
        if(data.success) {
          this.setChains(data.result)
        }
      }
    }
  }
</script>
