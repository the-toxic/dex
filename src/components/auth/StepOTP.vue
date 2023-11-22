<template>
	<h3 class="fs24 mb-10">{{ otpAttempts ? 'Enter Code' : 'Resend Code' }}</h3>
  <p v-if="otpAttempts" class="mb-4">We've sent a code to <span class="font-weight-bold">{{ email }}</span></p>

	<otp-input v-if="otpAttempts"
		ref="otpInput" v-model:value="otp"
		input-classes="otp-input" separator="" class="otpWrap"
		:num-inputs="6" :should-auto-focus="true" :is-disabled="!otpAttempts || loading || loadingResend"
		input-type="number" :placeholder="['', '', '', '', '', '']"
		@on-change="handleOnChange" @on-complete="handleOnComplete"
	/> <!-- letter-numeric -->
	<v-alert v-if="!otpAttempts" color="warning" variant="tonal" density="compact" border icon="mdi-alert" :prominent="true"
   title="The code has expired." text="Please resend the email with the new code." class="text-left mt-6">
	</v-alert>

	<v-btn v-if="otpAttempts" @click="sendRequestOTP" color="primary" block class="myBtn mt-8 text-none" size="large"
	 :loading="loading" :disabled="loading || otp.length !== 6">Next</v-btn>

	<v-btn v-else @click="onSubmitResendEmail" :loading="loadingResend" :disabled="loadingResend || timer > 0"
     color="primary" block class="myBtn mt-8 text-none" size="large" :text="`Request a new code${timer > 0 ? ` (${timer}s)` : ''}`"></v-btn>

	<p v-if="otpAttempts" class="mt-6 text-blue-grey-lighten-3">
		Didn't receive anything?
		<v-btn @click="onSubmitResendEmail" :loading="loadingResend" :disabled="loadingResend || timer > 0"
		 variant="text" color="secondary" class="text-none" :text="`Resend code${timer > 0 ? ` (${timer}s)` : ''}`" />
	</p>
</template>

<script>
import VOtpInput from "vue3-otp-input";
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";
import * as api from "@/api";

export default {
	name: "StepOTP",
	components: { OtpInput: VOtpInput },
	expose: ['onCaptchaPassed'], // call this method from parent component
	emits: ['completed'],
	props: {
		email: {
			type: String,
			required: true
		},
    attempts: {
      type: Number,
      required: true,
      validator: (value) => !isNaN(value)
    },
    initialTimer: {
      type: Number,
      required: true,
      validator: (value) => !isNaN(value)
    },
		action: {
			type: String,
			validator: (value) => ['sign-up', 'reset-password'].includes(value)
		},
	},
	data() { return  {
		loading: false,
		loadingResend: false,

		otp: '',
    otpAttempts: +this.attempts,
		timer: +this.initialTimer,
		timerId: null,
	}},
  created() {
    this.timerId = setInterval(() => {
      this.timer = this.timer - 1
      if(this.timer <= 0) clearInterval(this.timerId)
    }, 1000)
  },
  unmounted() {
		clearInterval(this.timerId)
	},
	methods: {
		...mapActions(useMainStore, {showAlert: 'showAlert'}),

		onCaptchaPassed(captcha) {
      this.sendRequestResendEmail(captcha)
		},

		// async onSubmitOTP() {
		// 	if(import.meta.env.VITE_APP_CAPTCHA_SIGN_UP === 'true') {
		// 		window.captchaObj.showCaptcha()
		// 		//   await this.recaptchaHandler('sign-up', this.sendRequestOTP)
		// 	} else {
		// 		await this.sendRequestOTP({})
		// 	}
		// },
		async sendRequestOTP() {
			if(this.otpAttempts <= 0) return
			this.loading = true
      const { data } = await api.otp({email: this.email, code: this.otp})
			this.loading = false
			window.captchaObj.reset();

			if(data.success) {
				this.$emit('completed', this.otp)
			} else {
				this.otpAttempts = this.otpAttempts - 1
				this.$refs.otpInput?.clearInput()
			}
		},

		async onSubmitResendEmail() {
      if((this.action === 'sign-up' && import.meta.env.VITE_APP_CAPTCHA_SIGN_UP === 'true')
      || (this.action === 'reset-password' && import.meta.env.VITE_APP_CAPTCHA_RESET_PASSWORD === 'true')) {
				window.captchaObj.showCaptcha()
			} else {
				await this.sendRequestResendEmail({})
			}
		},
		async sendRequestResendEmail(captcha) {
			this.loadingResend = true
      const { data } = await api.otpResend({ email: this.email, captcha })
			this.loadingResend = false
			window.captchaObj.reset();

			if(data.success) {
        this.otpAttempts = data.result?.attempts || +this.attempts
        this.timer = data.result?.timeout || 60

        clearInterval(this.timerId)
        this.timerId = setInterval(() => {
          this.timer = this.timer - 1
          if(this.timer <= 0) clearInterval(this.timerId)
        }, 1000)
      }

		},
		handleOnComplete (value) {
      this.sendRequestOTP()
    },
		handleOnChange (value) {},
	}
}
</script>


