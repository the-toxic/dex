<template>
  <h3 class="fs24 mb-10">Sign In</h3>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
    <v-text-field label="Email" filled
      v-model.trim="form.email"
      :rules="emailRules" class="mb-1" />

    <v-text-field label="Password" filled
      v-model.trim="form.password"
      name="password" type="password"
      :rules="passwordRules" class="mb-1" />

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
      }
    },
    computed: {
      emailRules() { return emailRules },
      passwordRules() { return passwordRules },
    },
    methods: {
      ...mapActions(useUserStore, {signIn: 'signIn'}),
      async onSubmit() {
        const { valid } = await this.$refs.form.validate()
        if(!valid) return false

        // if(import.meta.env.VITE_APP_RECAPTCHA_ENABLE_SIGN_IN === 'true') {
        //   await this.recaptchaHandler('sign-in', this.sendRequest) // callback sendRequest(token)
        // } else {
          await this.sendRequest('')
        // }
      },
      async sendRequest(token) {
        // this.form.recaptcha_response = token
        this.loading = true
        const data = await this.signIn(this.form)
        this.loading = false

        if(data.success) {
					// await this.$store.dispatch('showAlert', {msg: 'Successfully. Redirect...', color: 'success'})
					await this.$router.push({name: 'Pairs'})
        }
      }
    }
  }
</script>
