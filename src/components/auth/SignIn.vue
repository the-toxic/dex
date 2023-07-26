<template>
  <h3 class="fs24 mb-10">Sign In</h3>
  <v-form ref="form" @submit.prevent="onSubmit">
    <v-text-field label="Email"
      v-model.trim="form.email"
      :rules="emailRules" class="mb-1" />

    <v-text-field label="Password"
      v-model.trim="form.password"
      name="password" type="password"
      :rules="passwordRules" class="mb-1" />

    <div id="captchaBox"></div>

    <v-btn type="submit" color="primary" block class="myBtn mt-2 text-none" size="large"
     :loading="loading" :disabled="loading">Login</v-btn>

    <router-link :to="{name: 'AuthResetPassword'}" class="mt-8 fs16 d-inline-block text-none text-decoration-none text-secondary">Reset password</router-link>

    <v-divider class="mt-4" />
    <v-btn :to="{name: 'Home'}" variant="outlined" color="secondary" class="mt-6 text-none">Back to Home</v-btn>
    </v-form>
</template>

<script>
import { emailRules, passwordRules } from "@/helpers/mixins";
import { mapActions } from "pinia";
import { useUserStore } from "@/store/userStore";
import { useMainStore } from "@/store/mainStore";

  export default {
    name: 'SignIn',
    data() {
      return {
        loading: false,
        valid: true,
        form: {
          email: '',
          password: '',
          recaptcha_response: ''
        },
        CAPTCHA_SIGN_IN_ID: import.meta.env.VITE_APP_CAPTCHA_SIGN_IN_ID
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
          captchaId: _this.CAPTCHA_SIGN_IN_ID,
          product: "bind", // float | bind | popup
          userInfo: _this.form.email, // optional
          // mask: { bgColor: 'rgba(0,0,0,0.2)' }
        },
        function (captchaObj) {
          captchaObj.appendTo("#captchaBox"); // Insert the validation button into the captchaBox element in the host page
          window.captchaObj = captchaObj
          // window.captchaObj.showCaptcha()
          // window.captchaObj.showBox()
          // window.captchaObj.getValidate()
          captchaObj
            .onReady(function () {
              console.log('onReady')
            })
            .onSuccess(function () {
              console.log('onSuccess')
              const captcha = window.captchaObj.getValidate()
              _this.sendRequest(captcha)
            })
            .onError(function () {
              console.log('onError', arguments)
              _this.showAlert('Captcha error. Please try later...')
            });
        }
      );
    },
    computed: {
      emailRules() { return emailRules },
      passwordRules() { return passwordRules },
    },
    methods: {
      ...mapActions(useUserStore, {signIn: 'signIn'}),
      ...mapActions(useMainStore, {showAlert: 'showAlert'}),
      async onSubmit() {
        const { valid } = await this.$refs.form.validate()
        if(!valid) return false

        if(import.meta.env.VITE_APP_CAPTCHA_SIGN_IN === 'true') {
          window.captchaObj.showCaptcha()
        //   await this.recaptchaHandler('sign-in', this.sendRequest) // callback sendRequest(token)
        } else {
          await this.sendRequest({})
        }
      },
      async sendRequest(captcha) {
        // this.form.recaptcha_response = token

        this.loading = true
        // const data = await this.signIn(this.form)
        const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
        this.loading = false
        window.captchaObj.reset();

        if(data.success) {
          this.showAlert({msg: 'Successfully. Redirect...', color: 'success'})
          // window.captchaObj.reset();
          // window.captchaObj.destroy();
					// await this.$router.push({name: 'Pairs'})
        }
      }
    }
  }
</script>
