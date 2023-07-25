<template>
	<v-card tile color="transparent" :loading="loading">
		<v-card-text class="pa-6 pa-md-16 bor-4">

			<v-alert v-if="loading" prominent type="info" class="ma-10">Please wail...</v-alert>

			<div v-if="!loading && !success" class="">
				<h3 class="fs40 secondaryFont white--text text-center lh-1 mb-8">EMAIL CONFIRMATION</h3>
				<v-alert prominent outlined type="error" class="mb-0">Error confirming email!<br>It is possible that the email has already been confirmed or the token has expired.</v-alert>
			</div>

			<div v-if="!loading && success" class="text-center">
				<h3 class="fs40 secondaryFont white--text  lh-1 mb-7">EMAIL CONFIRMATION</h3>
				<p class="fs25 lh-30 mb-7 white--text black--text">Email successfully confirmed!</p>
				<v-btn class="myBtn px-6" height="60" :to="{name: 'AuthSignIn'}">Sign In</v-btn>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import {confirmEmail} from "@/api"
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";
// import * as tokenHelper from "@/helpers/jwt_token"

export default {
  name: 'AuthEmailConfirm',
  data() {
    return {
      loading: true,
      success: false,
    }
  },
  async created() {
    const { token } = this.$route.query
    try {
      if(!token || +token.length < 40) throw new Error('Invalid token')
      // const { payload } = tokenHelper.parseJWT(token)
      // if(!payload || !payload.expire || payload.action !== 'confirm') throw new Error('Invalid token [payload]')
      // if(payload.expire < this.nowTimestamp()) throw new Error('Token expired')
    } catch (e) {
      setTimeout(() => this.showAlert(e.message)) // bug on load page, need async
      await this.$router.replace({name: 'Home'})
      return
    }
    const {data} = await confirmEmail(token)
    this.loading = false

    if(typeof data === 'object' && data.success) {
      await this.$router.replace({ query: null }) // clear token in url
      this.success = true
    }
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'})
  }
}
</script>
