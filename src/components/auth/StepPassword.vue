<template>
	<h3 class="fs24 mb-10">{{ action === 'sign-up' ? 'Create Password' : 'Set New Password' }}</h3>
	<v-form ref="formPassword" @submit.prevent="onSubmitPassword" class="fill-width">
		<v-text-field label="Password"
			v-model.trim="password" name="password"
			:type="visiblePassword ? 'text' : 'password'"
			:append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visiblePassword = !visiblePassword"
			:rules="passwordRules" class="mb-2" />

		<v-text-field label="Repeat Password"
			v-model.trim="rePassword" type="password"
			:rules="[(password === rePassword) || 'Password must be match']" />

		<v-btn type="submit" color="primary" block class="myBtn mt-4 text-none" size="large"
		 :loading="loading" :disabled="loading">Next</v-btn>
	</v-form>
</template>

<script>
import { passwordRules } from "@/helpers/mixins";
import * as api from "@/api";

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
    INVITE_REQUIRED: import.meta.env.VITE_APP_INVITE_REQUIRED === 'true'
  }),
  computed: {
    passwordRules() { return passwordRules },
  },
  methods: {
    async onSubmitPassword() {
      const { valid } = await this.$refs.formPassword.validate()
      if(!valid) return false

      this.loading = true
      const { data } = await api.setPassword(this.password)
      this.loading = false

      if(data.success) {
        const isEndSignUp = !this.INVITE_REQUIRED && this.action === 'sign-up'
        this.$emit('completed', (isEndSignUp ? data.result.user : null)) // send object user after sign-up
      }
    },
  }
}
</script>


