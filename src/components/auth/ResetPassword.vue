<template>
  <h3 class="fs24 mb-10">Reset Password</h3>
  <v-form v-if="!success" ref="form" @submit.prevent="onSubmit">

    <v-text-field label="Email"
      v-model.trim="form.email"
      :rules="emailRules" hint="Enter the email you provided during registration" persistent-hint />

    <v-btn type="submit" color="primary" block size="large" class="myBtn text-none mt-6"
     :loading="loading" :disabled="loading">Send</v-btn>
  </v-form>

  <div v-else>
    <h3 class="fs35 fs-m21 lh-1 text-center white--text mb-7">Password Recovery</h3>
    <p class="fs20 lh-30 white--text mt-6 mt-md-16">An email with instructions for creating a new password has been sent to you.</p>
  </div>
</template>

<script>
import { resetPassword } from "@/api"
import { emailRules, passwordRules } from "@/helpers/mixins";
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";

  export default {
    name: 'ResetPassword',
    data() {
      return {
        loading: false,
        success: false,
        form: {
          email: '',
          recaptcha_response: ''
        },
        // successMessage: ''
      }
    },
    computed: {
      emailRules() { return emailRules },
    },
    methods: {
      ...mapActions(useMainStore, {showAlert: 'showAlert'}),
      async onSubmit() {
        const { valid } = await this.$refs.form.validate()
        if(!valid) return false

        // if(import.meta.env.VITE_APP_RECAPTCHA_ENABLE_RECOVERY === 'true') {
        //   await this.recaptchaHandler('password-recovery', this.sendRequest) // callback sendRequest(token)
        // } else {
          await this.sendRequest('')
        // }
      },
      async sendRequest(token) {
        // this.form.recaptcha_response = token

        this.loading = true
        const {data} = await resetPassword(this.form)
        this.loading = false

        if(data.success) {
          this.success = true
          // this.successMessage = data.result.message
        } else {
					// this.showAlert({msg: 'Server error', color: 'error'})
				}
      }
    }
  }
</script>
