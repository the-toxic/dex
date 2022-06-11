import Vue from "vue"

// import {emailRegex} from '@/helpers/common'
// import {urlRegex} from '@/helpers/common'

Vue.mixin({
	data() {
		return {
			PROJECT_NAME: process.env.VUE_APP_PROJECT_NAME
	// 		emailRules: [
	// 			v => !!v || 'Email is required',
	// 			v => emailRegex.test(v) || 'Email is invalid',
	// 		],
	// 		nameRules: [
	// 			v => !!v || 'Field is required',
	// 			v => /^[\w]{2,64}$/.test(v) || 'Name of user, only alphabet, 2 - 64 characters',
	// 		],
	// 		passwordRules: [
	// 			v => !!v || 'Field is required',
	// 			v => /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])[\w~!?.,@#$%^&*=+-]{6,25}$/.test(v) || 'Password must be at least one lowercase letter, uppercase letter and number. 6 - 25 characters',
	// 		],
	// 		urlRules: [
	// 			v => !!v || 'Field is required',
	// 			v => urlRegex.test(v) || 'Invalid site address',
	// 		],
		}
	},
	methods: {
		toNumber: (value, isRound = false) => isNaN(value) ? 0 : new Intl.NumberFormat('en-US').format(isRound ? Math.round(value) : value),
		toCurrency: (value, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'usd' }).format(isNaN(value) ? 0 : +value),
		capitalize: (words, separator = ' ') => words.split(separator).map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(separator),
		nowTimestamp: () => +(+new Date()).toString().slice(0, 10),
		shortAddress: (wallet) => wallet ? wallet.slice(0,6) + '...' + wallet.slice(-4) : wallet,
		logger: (str) => console.log(str) ,
	}
})