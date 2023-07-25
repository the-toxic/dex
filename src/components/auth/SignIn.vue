<template>
	<v-card :loading="loading" tile elevation="0" class="mx-auto mx-md-0 fill-width">
		<v-card-text class="fill-height d-flex align-center pa-6 px-md-8 pt-md-14">
			<v-row>
				<v-col cols="12" lg="12">
					<v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
            <h3 class="fs24 mb-10">Sign In</h3>
						<v-text-field label="Email" filled
              v-model.trim="form.email"
              :rules="emailRules" />

						<v-text-field label="Password" filled
              v-model.trim="form.password"
              name="password" type="password"
              :rules="passwordRules" />

						<v-btn type="submit" color="primary" block class="myBtn text-none mt-4" size="large"
						 :loading="loading" :disabled="loading">Login</v-btn>

            <router-link :to="{name: 'AuthResetPassword'}" class="mt-6 fs16 d-inline-block text-none text-decoration-none ">Reset password</router-link>
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
        const { isValid } = await this.$refs.form.validate()
        if(!isValid) return false

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
