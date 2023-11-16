import { defineStore } from "pinia";

const localStorageTheme = window.localStorage.getItem('theme')
const showCookiePopup = !window.localStorage.getItem('cookiePopup')
const chains = JSON.parse(window.localStorage.getItem('chains'))

export const useMainStore = defineStore('main', {
	state: () => ({
		globalLoader: false,
		theme: localStorageTheme || 'dark',
    alert: {
      msg: '',
      color: ''
    },
    wsConnected: false,
    searchDialog: false,
    dialog: false,
    chains: chains || null,
    chainTypes: ['EVM', 'Tron', 'Bitcoin', 'Other'], // 'Solana', 'Dash', 'Litecoin', 'Dogecoin'
    networks: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'],
    // subscribeForm: false,
    showCookie: showCookiePopup,
	}),
	getters: {
		// getTheme: (state) => state.theme
	},
	actions: {
    setGlobalLoader(visible) {
      this.globalLoader = visible
    },
		setTheme(name) {
			this.theme = name
      window.localStorage.setItem('theme', name)
    },
    showAlert(payload) {
      if (typeof payload === "string") payload = {msg: payload, color: 'error'}
      this.alert.msg = payload.msg || ''
      this.alert.color = payload.color || ''
      setTimeout(() => {
        this.alert.msg = ''
        this.alert.color = ''
      }, 7000)
    },
    setConnected(payload) {
      this.wsConnected = payload || false
    },
    showDialog(name) {
      this.dialog = name || false
    },
    toggleSearchDialog(payload) {
      this.searchDialog = payload
    },
    setChains(payload) {
      this.chains = payload
      window.localStorage.setItem('chains', JSON.stringify(payload))
    },
    // showSubscribeForm(visible) {
    //   this.subscribeForm = visible || false
    // },
    cookieAccept() {
      window.localStorage.setItem('cookiePopup', 'accept')
      this.showCookie = false
    },

	}
})
