<template>
	<v-card :loading="loading" tile elevation="0" class="mx-auto mx-md-0" style="max-width: 500px; width: 100%; min-height: 460px; background: transparent">
		<v-card-text class="fill-height d-flex align-center pa-6 px-md-8 py-md-14">
			<v-row>
				<v-col cols="12" lg="12">
					<v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">

						<v-text-field label="Email" filled
							v-model.trim="form.email"
							:rules="emailRules" dense />

						<v-text-field label="Password" filled
							v-model.trim="form.password"
							name="password" type="password"
							:rules="passwordRules" dense />

						<router-link :to="{name: 'AuthResetPassword'}" class="yellowText2 fs16 text-decoration-none">Reset password</router-link>

						<v-btn type="submit" class="myBtn myYellowBtn font-weight-bold fill-width mt-6 fs20" height="60"
						 :loading="loading"
						 :disabled="!valid || loading"
						>Login</v-btn>
					</v-form>
				</v-col>

<!--				<v-col cols="12" lg="4" class="text-left socialBox">-->
<!--					<p class="fs14" style="color: #8D8D8D">Via Wallet</p>-->
<!--				</v-col>-->
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
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
    methods: {
      async onSubmit() {
        const isValid = this.$refs.form.validate()
        if(!isValid) return false

        // if(process.env.VUE_APP_RECAPTCHA_ENABLE_SIGN_IN === 'true') {
        //   await this.recaptchaHandler('sign-in', this.sendRequest) // callback sendRequest(token)
        // } else {
          await this.sendRequest('')
        // }
      },
      async sendRequest(token) {
        // this.form.recaptcha_response = token
        this.loading = true
        const data = await this.$store.dispatch('user/signIn', this.form)
        this.loading = false

        if(data.success) {
					// await this.$store.dispatch('showAlert', {msg: 'Successfully. Redirect...', color: 'success'})
					await this.$router.push({name: 'Pairs'})
        }
      }
    }
  }
</script>
