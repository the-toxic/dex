<template>
<!--	<div id="captchaBox"></div>-->
</template>

<script setup>
	import { onUnmounted, ref } from "vue";
	import { useScript } from "@unhead/vue";
	import { useMainStore } from "@/store/mainStore";
	const mainStore = useMainStore()

	// defineProps({any: String})

	const emits = defineEmits(['successCaptcha'])

	const script = useScript({
		src: 'https://static.geetest.com/v4/gt4.js', onload: () => { onIntiCaptcha()}, tagPosition: 'bodyClose' }
	)

	function onIntiCaptcha() {
		console.log('captcha init', typeof initGeetest4 === 'function')
		initGeetest4(
			{
				captchaId: import.meta.env.VITE_APP_CAPTCHA_ID,
				product: "bind", // float | bind | popup
				// userInfo: _this.form.email, // optional
				// mask: { bgColor: 'rgba(0,0,0,0.2)' }
			},
			function (captchaObj) {
				// captchaObj.appendTo("#captchaBox"); // Insert the validation button into the captchaBox element in the host page
				window.captchaObj = captchaObj
				captchaObj
					.onReady(function () { /* console.log('onReady')*/ })
					.onError(function () { console.log('onError', arguments); mainStore.showAlert('Captcha error. Please try later...') })
					.onSuccess(function () {
						const captcha = window.captchaObj.getValidate()
						emits('successCaptcha', captcha)
					})
			}
		);
	}
	onUnmounted(() => {
		window.captchaObj?.destroy()
		script.$script.remove()
	})
</script>

