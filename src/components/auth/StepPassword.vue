<template>
	<h3 class="fs24 mb-10">{{ action === 'sign-up' ? 'Create Password' : 'Set New Password' }}</h3>
	<v-form ref="formPassword" @submit.prevent="onSubmitPassword" class="fill-width">
		<v-text-field label="Password"
			v-model.trim="password" name="password"
			:type="visiblePassword ? 'text' : 'password'"
			:append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visiblePassword = !visiblePassword"
			:rules="passwordRules" />

		<v-text-field label="Repeat Password"
			v-model.trim="rePassword" type="password"
			:rules="[(password === rePassword) || 'Password must be match']" />

		<v-btn type="submit" color="primary" block class="myBtn mt-4 text-none" size="large"
		 :loading="loading" :disabled="loading">Next</v-btn>
	</v-form>
</template>

<script>
import { passwordRules } from "@/helpers/mixins";
// import { mapStores } from "pinia";
// import { useMainStore } from "@/store/mainStore";

export default {
  name: "StepPassword",
  emits: ['completed'],
  props: {
    action: {
      type: String,
      validator(value) {
        return ['sign-up', 'reset-password'].includes(value)
      }
    },
  },
  data: () => ({
    loading: false,

    password: '',

    rePassword: '',
    visiblePassword: false,
  }),
  computed: {
    // ...mapStores(useMainStore),
    passwordRules() { return passwordRules },
  },
  methods: {
    async onSubmitPassword() {
      const { valid } = await this.$refs.formPassword.validate()
      if(!valid) return false

      this.loading = true
      const data = await new Promise(resolve => setTimeout(() => {resolve({success: true})}, 500))
      if(this.action === 'sign-up') {
        // const data = await this.userStore.signUpPassword(this.password)
      } else if(this.action === 'reset-password') {
        // const data = await this.userStore.resetPassword(this.password)
      }
      this.loading = false

      if(data.success) {
        this.$emit('completed')
      }
    },
  }
}
</script>


