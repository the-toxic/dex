import { defineStore } from "pinia";
import { Chains } from "@/types";

const localStorageTheme = window.localStorage.getItem('theme')
const showCookiePopup = !window.localStorage.getItem('cookiePopup')
const chains: Chains = JSON.parse(window.localStorage.getItem('chains') as string)

export const useMainStore = defineStore('main', {
	state: () => ({
		globalLoader: false,
		theme: localStorageTheme || 'dark',
    alert: {
      msg: '',
      color: ''
    },
    wsConnected: 'loading',
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
    setGlobalLoader(visible: boolean) {
      this.globalLoader = visible
    },
		setTheme(name: string) {
			this.theme = name
      window.localStorage.setItem('theme', name)
    },
    showAlert(payload: string | {msg: string, color: string}) {
      if (typeof payload === "string") payload = {msg: payload, color: 'error'}
      this.alert.msg = payload.msg || ''
      this.alert.color = payload.color || ''
      setTimeout(() => {
        this.alert.msg = ''
        this.alert.color = ''
      }, 7000)
    },
    setConnected(payload: boolean | 'loading') {
      this.wsConnected = payload as string
    },
    showDialog(name: boolean) {
      this.dialog = name || false
    },
    toggleSearchDialog(payload: boolean) {
      this.searchDialog = payload
    },
    setChains(payload: Chains) {
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
