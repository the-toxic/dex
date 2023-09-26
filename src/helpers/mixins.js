
import {emailRegex} from '@/helpers/common'
// import {urlRegex} from '@/helpers/common'

export const PROJECT_NAME = import.meta.env.VITE_APP_PROJECT_NAME
export const API_DOMAIN = import.meta.env.VITE_APP_API_DOMAIN
export const DOCS_HOST = import.meta.env.VITE_APP_DOCS_HOST
export const NEWS_HOST = import.meta.env.VITE_APP_NEWS_HOST

export const emailRules = [
  v => !!v || 'Field is required',
  v => emailRegex.test(v) || 'Invalid email',
]
export const nameRules = [
  v => !!v || 'Field is required',
  v => /^[\w]{2,64}$/.test(v) || 'Name of user, only alphabet, 2 - 64 characters',
]
export const passwordRules = [
  v => !!v || 'Field is required',
  v => /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])[\w~!?.,@#$%^&*=+-]{6,25}$/.test(v) || 'Password must be at least one lowercase letter, uppercase letter and number. 6 - 25 characters',
]
/*export const urlRules = [
  v => !!v || 'Field is required',
  v => urlRegex.test(v) || 'Invalid site address',
],*/
export const SOCIAL_TWITTER = import.meta.env.VITE_APP_SOCIAL_TWITTER
export const SOCIAL_TELEGRAM = import.meta.env.VITE_APP_SOCIAL_TELEGRAM
export const SOCIAL_LINKTREE = import.meta.env.VITE_APP_SOCIAL_LINKTREE

export const toNumber = (value, isRound = false) => isNaN(value) ? 0 : new Intl.NumberFormat('en-US').format(isRound ? Math.round(value) : value)
export const toCurrency = (value, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'usd' }).format(isNaN(value) ? 0 : +value)
export const capitalize = (words, separator = ' ') => words.split(separator).map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(separator)
export const nowTimestamp = () => +(+new Date()).toString().slice(0, 10)
export const shortAddress = (wallet, left = 6, right = 4) => wallet ? wallet.slice(0,left) + '...' + wallet.slice(-Math.abs(right)) : wallet
export const shortString = (string, length = 16) => !string ? '' : (string.length > length ? string.slice(0,length) : string)
export const logger = (str) => console.log(str)

export const formatNumber = (number, shortBigNumber = false) => {
  number = +number
  if(number === 0) return 0
  if (number >= 1000)
    return shortBigNumber ? formatBigNumber(number) : toNumber(number)
  else if (number > 100)
    return parseFloat(number).toFixed(2).toString()
  else if (number > 1)
    return parseFloat(number).toFixed(3).toString()
  else if (number > 1e-4) // 0.0001 - 1
    return parseFloat(parseFloat(number).toExponential(4)).toString()
  else // < 0.000001
    return formatLowestNumber(number) // return exponentToNumber(+parseFloat(price).toExponential(4))
}

export const formatBigNumber = (num, minToFormat = 1_000_000) => {
  if(num < minToFormat) return toNumber(num)
  // return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short", minimumFractionDigits: 2, maximumFractionDigits: 3, style: "currency", currency: "USD", }).format(11111112.00007111);
  const map = [ { suffix: 'T', threshold: 1e12 }, { suffix: 'B', threshold: 1e9 }, { suffix: 'M', threshold: 1e6 }, { suffix: 'K', threshold: 1e3 }, { suffix: '', threshold: 1 }, ];
  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) return (num / found.threshold).toFixed(3) + found.suffix;
  return num;
}

export const formatLowestNumber = (number) => {
  const endNumbers = Number(number).toExponential().split('e')[0].replace('.', '').substring(0,4)
  const zeros =  -Math.floor( Math.log10(number) + 1)
  const subNumber = String.fromCharCode(parseInt(`208${zeros}`,16))
  return '0.0' + subNumber + endNumbers
}

// // "vue-recaptcha-v3": "^1.9.0",
// async recaptchaHandler(action, cb) {
// 	// console.log(this.$recaptchaInstance)
// 	await this.$recaptchaLoaded()
// 	await this.$recaptcha(action)
// 	let token
// 	let intervalId = setInterval(() => {
// 		token = this.$recaptchaInstance.recaptcha.getResponse()
// 		if(token) {
// 			clearInterval(intervalId)
// 			this.$recaptchaInstance.recaptcha.reset()
// 			cb(token)
// 		}
// 	}, 200)
// 	setTimeout(() => clearInterval(intervalId), 60 * 1000)
// }
