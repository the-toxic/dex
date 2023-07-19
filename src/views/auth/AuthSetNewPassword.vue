<template>
	<v-card tile :loading="loading" class="mx-auto mx-md-0" style="max-width: 670px; border: 4px solid #2B2B2B; background: transparent">
		<v-card-text class="pa-6 px-md-8 py-md-14">
			<h3 class="fs35 fs-m21 secondaryFont lh-1 text-center white--text mb-7">Password Recovery</h3>

			<v-form v-if="!success" ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
				<v-text-field label="New Password" filled
					v-model.trim="form.password"
					name="password" type="password" counter="25"
					:rules="passwordRules"
				/>
				<v-text-field label="Repeat new Password" filled
					v-model.trim="re_new_pass"
					name="re_password" type="password" counter="25"
					:rules="[...passwordRules, (form.password === re_new_pass) || 'Password must be match']"
				/>
				<v-btn type="submit" block class="myBtn myYellowBtn font-weight-bold " height="60"
					:loading="loading" :disabled="!valid || loading"
				>Confirm</v-btn>

				<p class="text-h6 text-center mt-6">I know my password. <router-link :to="{name: 'AuthSignIn'}">Sign In</router-link></p>
			</v-form>

			<div v-if="success" class="text-center">
				<p class="fs25 lh-30 mb-7 white--text">New password has successfully set!</p>
				<v-btn :to="{name: 'AuthSignIn'}" class="myBtn myYellowBtn font-weight-bold fs20" width="200" height="60">Sign In</v-btn>
			</div>

		</v-card-text>
	</v-card>
</template>

<script>
import {setNewPassword} from "@/api"
import * as tokenHelper from "@/helpers/jwt_token"

  export default {
    name: 'AuthSetNewPassword',
    data() {
      return {
        loading: false,
        valid: true,
        success: false,
        form: {
          password: '',
          token: '',
        },
        re_new_pass: ''
      }
    },
    created() {
      const query = this.$route.query
      try {
        if(!query.token || +query.token.length < 32 || +query.token.length > 128) throw new Error('Invalid token')
        const { payload } = tokenHelper.parseJWT(query.token)
        if(!payload || !payload.expire || payload.action !== 'recovery') throw new Error('Invalid token [payload]')
        if(payload.expire < this.nowTimestamp()) throw new Error('Token expired')
      } catch (e) {
        setTimeout(() => this.$store.dispatch('showAlert', e.message)) // bug on load page, need async
        this.$router.replace({name: 'Home'})
        return
      }
      this.form.token = query.token
    },
    methods: {
      async onSubmit() {
        const isValid = this.$refs.form.validate()
        if(!isValid) return false

        this.loading = true
        const {data} = await setNewPassword(this.form)
        this.loading = false

        if(data.success) {
          this.success = true
          await this.$router.replace({ query: null }) // clear token in url
        }
      }
    }
  }
</script>
