<template>
	<v-card :loading="loading" tile elevation="0" class="mx-auto mx-md-0" style="max-width: 500px; width: 100%; min-height: 460px; background: transparent">
		<v-card-text class="fill-height d-flex align-center pa-6 px-md-8 py-md-14">

			<v-row v-if="!success">
				<h3 class="fs35 fs-m21 secondaryFont lh-1 text-center white--text mb-7 ml-3">Password Recovery</h3>
				<v-col cols="12" lg="12">
					<v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">

						<v-text-field label="Email" filled
							v-model.trim="form.email"
							:rules="emailRules" dense />
						<p class="fs14" style="color: #8D8D8D">Enter the email you provided during registration</p>

						<v-btn type="submit" class="myBtn myYellowBtn font-weight-bold fill-width fs20" height="60"
						 :loading="loading"
						 :disabled="!valid || loading"
						>Send</v-btn>
					</v-form>
				</v-col>

<!--				<v-col cols="12" lg="4" class="text-left socialBox">-->
<!--					<p class="fs14" style="color: #8D8D8D">Enter the email you provided during registration</p>-->
<!--				</v-col>-->
			</v-row>

			<div v-else>
				<h3 class="fs35 fs-m21 secondaryFont lh-1 text-center white--text mb-7">Password Recovery</h3>
				<p class="fs20 lh-30 white--text mt-6 mt-md-16">An email with instructions for creating a new password has been sent to you.</p>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { resetPassword } from "@/api"

  export default {
    name: 'ResetPassword',
    data() {
      return {
        loading: false,
        valid: true,
        success: false,
        form: {
          email: '',
          recaptcha_response: ''
        },
        // successMessage: ''
      }
    },
    methods: {
      async onSubmit() {
        const isValid = this.$refs.form.validate()
        if(!isValid) return false

        // if(process.env.VUE_APP_RECAPTCHA_ENABLE_RECOVERY === 'true') {
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
					this.$store.dispatch('showAlert', {msg: 'Server error', color: 'error'}).then()
				}
      }
    }
  }
</script>
