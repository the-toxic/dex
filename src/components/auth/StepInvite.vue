<template>
	<h3 class="fs24 mb-6">Whitelist</h3>
	<p v-if="action === 'sign-up'" class="fs16 mb-4">Thank you for registration!</p>
	<p class="fs16 mb-6">Follow us:
		<v-btn icon variant="tonal" color="black" :href="SOCIAL_TWITTER" target="_blank" class="ml-2">
			<v-img width="30" height="30" src="@/assets/social_twitter.svg"/>
		</v-btn>
		<v-btn icon variant="tonal" color="black" :href="SOCIAL_TELEGRAM" target="_blank" class="ml-2">
			<v-img width="30" height="30" src="@/assets/social_telegram.svg" class="mr-1"/>
		</v-btn>
		<v-btn icon variant="tonal" color="black" :href="SOCIAL_DISCORD" target="_blank" class="ml-2">
			<v-img width="30" height="30" src="@/assets/social_discord.svg"/>
		</v-btn>
	</p>
	<p class="fs16 text-blue mb-2">If you have invite code you can continue</p>
	<v-form ref="formInvite" @submit.prevent="onSubmitInvite" class="fill-width">
		<v-text-field label="Invite code" v-model.trim="invite"
      :rules="[v => v.length === 6 || 'Incorrect length']"/>

		<v-btn type="submit" color="primary" block class="myBtn mt-2 text-none" size="large"
     :loading="loading" :disabled="loading">Next</v-btn>

		<v-divider class="mt-4"/>
		<v-btn :to="{name: 'Home'}" variant="outlined" color="secondary" class="mt-6 text-none">Back to Home</v-btn>
	</v-form>
</template>

<script>
import { SOCIAL_DISCORD, SOCIAL_TELEGRAM, SOCIAL_TWITTER } from "@/helpers/mixins";
import * as api from "@/api";

export default {
	name: 'StepInvite',
  expose: ['onCaptchaPassed'], // call this method from parent component
  emits: ['completed'],
  props: {
    email: {
      type: String,
      required: true
    },
    action: {
      type: String,
      validator(value) {
        return ['sign-up', 'sign-in'].includes(value)
      }
    },
  },
  data: () => ({
		loading: false,
		invite: '',
    SOCIAL_TWITTER, SOCIAL_TELEGRAM, SOCIAL_DISCORD,
  }),
  methods: {
    onCaptchaPassed(captcha) {
      this.sendRequestInvite(captcha)
    },
    async onSubmitInvite() {
      const { valid } = await this.$refs.formInvite.validate()
      if(!valid) return false

      if((this.action === 'sign-up' && import.meta.env.VITE_APP_CAPTCHA_SIGN_UP === 'true')
      || (this.action === 'sign-in' && import.meta.env.VITE_APP_CAPTCHA_SIGN_IN === 'true')) {
        window.captchaObj.showCaptcha()
      } else {
        await this.sendRequestInvite({})
      }
    },
    async sendRequestInvite(captcha) {
      this.loading = true
      const { data } = await api.inviteRequest({email: this.email, invite: this.invite, captcha})
      this.loading = false
      window.captchaObj.reset();

      if(data.success) {
        this.$emit('completed', data.result.user) // send object user after sign-up or sign-in
      }
    },
  }
}
</script>
