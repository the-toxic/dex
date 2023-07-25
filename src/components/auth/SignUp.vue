<template>
	<v-card :loading="loading" tile elevation="0" class="mx-auto mx-md-0 fill-width">
		<v-card-text class="fill-height d-flex align-center pa-6 px-md-8 pt-md-14">
			<v-row v-if="!isSubmitted">
				<v-col cols="12" lg="12">
					<v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">

            <h3 class="fs24 mb-10">Sign Up</h3>
						<v-text-field label="Email" filled
              v-model.trim="form.email"
              :rules="emailRules" />

						<v-text-field label="Password" filled
              v-model.trim="form.password" name="password"
              :type="visiblePassword ? 'text' : 'password'"
              :append-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="visiblePassword = !visiblePassword"
              :rules="passwordRules" />

						<v-text-field label="Repeat Password" filled
							v-model.trim="rePassword" type="password"
							:rules="[(form.password === rePassword) || 'Password must be match']" />

						<v-checkbox v-model="agree" :rules="[v => !!v || 'Need agree with policy']" class="mt-0">
							<template v-slot:label>
									<span class="flex-wrap">
										I agree with <a @click.stop target="_blank" :href="'/legal/privacy-policy'" class="text-decoration-underline">Privacy Policy</a>
										& <a @click.stop target="_blank" :href="'/legal/terms-of-use'" class="text-decoration-underline">Terms</a>
									</span>
							</template>
						</v-checkbox>

						<v-btn type="submit" color="primary" block class="myBtn text-none" size="large"
						 :loading="loading" :disabled="loading">Create account</v-btn>
					</v-form>
				</v-col>

<!--				<v-col cols="12" lg="4" class="text-left socialBox">-->
<!--					<p class="fs14" style="color: #8D8D8D">Via Wallet</p>-->
<!--				</v-col>-->
			</v-row>
			<div v-if="isSubmitted">
				<v-alert color="info">
					<h3>Confirm your Email</h3>
					<p>Please check your inbox for a confirmation email.</p>
					<p>Click the link in the email to confirm your email address.</p>
				</v-alert>
				<v-btn @click="resendEmail" class="myBtn font-weight-bold fill-width mt-2 fs20" height="60" :loading="loading" :disabled="loading"
					>Re-send confirmation email</v-btn>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import { emailRules, passwordRules } from "@/helpers/mixins";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/userStore";

export default {
  name: 'SignUp',
  data() {return {
		loading: false,
		valid: true,
		isSubmitted: false,
		form: {
			// nickname: '',
			email: '',
			password: '', // required on create acc
			recaptcha_response: ''
		},
    agree: true,
		rePassword: '',
		visiblePassword: false
	}},
  computed: {
    ...mapStores(useUserStore),
    emailRules() { return emailRules },
    passwordRules() { return passwordRules },
  },
  methods: {
    async onSubmit() {
      const { isValid } = this.$refs.form.validate()
      if(!isValid) return false

      // if(import.meta.env.VITE_APP_RECAPTCHA_ENABLE_SIGN_UP === 'true') {
      //   await this.recaptchaHandler('sign-up', this.sendRequest) // callback sendRequest(token)
      // } else {
        await this.sendRequest('')
      // }
    },
    async sendRequest(token) {
      this.form.recaptcha_response = token
      this.loading = true
      const data = await this.userStore.signUp(this.form)

      this.loading = false

      if(data.success) {
				this.isSubmitted = true
				// await this.$store.dispatch('showAlert', {msg: 'Account successfully created', color: 'success'})
        // await this.$router.push({name: 'Pairs'})
      }
    },
		async resendEmail() {
			this.loading = true
			const data = await this.userStore.resendConfirmEmail(this.form)
			this.loading = false
		}
		// async onSubmit() {
		// 	const isValid = this.$refs.form.validate()
		// 	if(!isValid) return false
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
