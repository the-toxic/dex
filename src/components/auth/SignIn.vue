<template>
  <template v-if="step === 'email'">
    <h3 class="fs24 mb-10">Sign In</h3>
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

      <router-link :to="{name: 'AuthResetPassword'}" class="mt-8 fs16 d-inline-block text-none text-decoration-none text-secondary">Reset password</router-link>

      <v-divider class="mt-4" />
      <v-btn :to="{name: 'Home'}" variant="outlined" color="secondary" class="mt-6 text-none">Back to Home</v-btn>
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

  export default {
    name: 'SignIn',
    components: { StepInvite },
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
      ...mapActions(useMainStore, {showAlert: 'showAlert'}),

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
            this.logIn(data.result.user)
            await this.$router.replace({name: 'Console'})
          }
        }
      },

      async onCompleteInvite(userObject) {
        this.logIn(userObject)
        this.$router.replace({name: 'Console'})
      },
    }
  }
</script>
