
import {emailRegex} from '@/helpers/common'
// import {urlRegex} from '@/helpers/common'

export const PROJECT_NAME = import.meta.env.VITE_APP_PROJECT_NAME
export const API_DOMAIN = import.meta.env.VITE_APP_API_DOMAIN
export const DOCS_HOST = import.meta.env.VITE_APP_DOCS_HOST
export const NEWS_HOST = import.meta.env.VITE_APP_NEWS_HOST

export const emailRules = [
  (v: string) => !!v || 'Field is required',
  (v: string) => emailRegex.test(v) || 'Invalid email',
]
export const nameRules = [
  (v: string) => !!v || 'Field is required',
  (v: string) => /^[\w]{2,64}$/.test(v) || 'Name of user, only alphabet, 2 - 64 characters',
]
export const passwordRules = [
  (v: string) => !!v || 'Field is required',
  (v: string) => /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])[\w~!?.,@#$%^&*=+-]{6,25}$/.test(v) || 'Password must be at least one lowercase letter, uppercase letter and number. 6 - 25 characters',
]
/*export const urlRules = [
  (v: string) => !!v || 'Field is required',
  (v: string) => urlRegex.test(v) || 'Invalid site address',
],*/

export const chainTypesRegex = {
  EVM: /^0x[0-9a-fA-F]{40}$/g,
  Bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/ig,
  Tron: /^T[A-Za-z1-9]{33}$/g,
  Solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/g,
  Dash: /X[1-9A-HJ-NP-Za-km-z]{33}$/g,
  Litecoin: /^([LM3][a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[a-z0-9]{39,59})$/,
  Dogecoin: /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/,
}
export const chainTypeWalletRules = (chainType: string) => [
  (v: string) => chainType !== 'EVM' || /^0x[0-9a-fA-F]{40}$/g.test(v) || 'Invalid EVM format, check length and lower/upper-case',
  (v: string) => chainType !== 'Bitcoin' || /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/ig.test(v) || 'Invalid Bitcoin format, check length and lower/upper-case',
  (v: string) => chainType !== 'Tron' || /^T[A-Za-z1-9]{33}$/g.test(v) || 'Invalid Tron format, check length and lower/upper-case',
  (v: string) => chainType !== 'Solana' || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/g.test(v) || 'Invalid Solana format, check length and lower/upper-case',
  (v: string) => chainType !== 'Dash' || /X[1-9A-HJ-NP-Za-km-z]{33}$/g.test(v) || 'Invalid Dash format, check length and lower/upper-case',
  (v: string) => chainType !== 'Litecoin' || /^([LM3][a-km-zA-HJ-NP-Z1-9]{26,33}|ltc1[a-z0-9]{39,59})$/.test(v) || 'Invalid Litecoin format, check length and lower/upper-case',
  (v: string) => chainType !== 'Dogecoin' || /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/.test(v) || 'Invalid Dogecoin format, check length and lower/upper-case',
]

export const SOCIAL_TWITTER = import.meta.env.VITE_APP_SOCIAL_TWITTER
export const SOCIAL_TELEGRAM = import.meta.env.VITE_APP_SOCIAL_TELEGRAM
export const SOCIAL_TELEGRAM_CHANNEL = import.meta.env.VITE_APP_SOCIAL_TELEGRAM_CHANNEL
export const SOCIAL_DISCORD = import.meta.env.VITE_APP_SOCIAL_DISCORD
export const SOCIAL_LINKTREE = import.meta.env.VITE_APP_SOCIAL_LINKTREE
export const SOCIAL_WP = import.meta.env.VITE_APP_SOCIAL_WP

export const toNumber = (value: any, isRound = false) => isNaN(value) ? 0 : new Intl.NumberFormat('en-US').format(isRound ? Math.round(value) : value)
export const toCurrency = (value: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'usd' }).format(isNaN(value) ? 0 : +value)
export const capitalize = (words: string, separator = ' ') => words.split(separator).map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(separator)
export const nowTimestamp = () => +(+new Date()).toString().slice(0, 10)
export const shortAddress = (wallet: string, left = 6, right = 4) => wallet ? wallet.slice(0,left) + '...' + wallet.slice(-Math.abs(right)) : wallet
export const shortString = (string: string, length = 16) => !string ? '' : (string.length > length ? string.slice(0,length) : string)
export const logger = (str: string) => console.log(str)

export const formatNumber = (number: number, shortBigNumber = false) => {
  if(isNaN(number)) return 0
  number = +number
  if(number === 0) return 0
  if(number < 0) number = Math.abs(number)

  if (number >= 1000)
    return shortBigNumber ? formatBigNumber(number) : toNumber(number)
  else if (number > 100)
    return parseFloat(String(number)).toFixed(2).toString()
  else if (number > 1)
    return parseFloat(String(number)).toFixed(3).toString()
  else if (number > 1e-4) // 0.0001 - 1
    return parseFloat(parseFloat(String(number)).toExponential(4)).toString()
  else // < 0.000001
    return formatLowestNumber(number) // return exponentToNumber(+parseFloat(price).toExponential(4))
}

export const formatBigNumber = (num: number, minToFormat = 1_000_000, round = false) => {
  if(num < minToFormat) return toNumber(num)
  // return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short", minimumFractionDigits: 2, maximumFractionDigits: 3, style: "currency", currency: "USD", }).format(11111112.00007111);
  const map = [ { suffix: 'T', threshold: 1e12 }, { suffix: 'B', threshold: 1e9 }, { suffix: 'M', threshold: 1e6 }, { suffix: 'K', threshold: 1e3 }, { suffix: '', threshold: 1 }, ];
  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) return (num / found.threshold).toFixed(round ? 0 : 2) + found.suffix;
  return num;
}

export const formatLowestNumber = (number: number) => {
  const endNumbers = Number(number).toExponential().split('e')[0].replace('.', '').substring(0,4)
  const zeros =  -Math.floor( Math.log10(number) + 1)
  let subNumber
  if(zeros > 9) {
    subNumber = String.fromCharCode(parseInt(`2081`,16)) + String.fromCharCode(parseInt(`208${zeros - 10}`,16))
  } else {
    subNumber = String.fromCharCode(parseInt(`208${zeros}`,16))
  }
  return '0.0' + subNumber + endNumbers
}

export const needInvert = (token0: string, token1: string) => {
  const stables = ['BUSD','TUSD','USDT','USDC','DAI','USD']
  const natives = ['WBNB','BNB','WETH','ETH']
  // return  (stables.includes(token0) && !stables.includes(token1)) || (natives.includes(token0) && !stables.includes(token1))
  return (stables.includes(token0) || natives.includes(token0)) && !stables.includes(token1) // shortest
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
