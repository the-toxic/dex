import { defineStore } from "pinia";

const localStorageTheme = window.localStorage.getItem('theme')
const showCookiePopup = !window.localStorage.getItem('cookiePopup')

export const useMainStore = defineStore('main', {
	state: () => ({
		globalLoader: false,
		theme: localStorageTheme || 'dark',
    alert: {
      msg: '',
      color: ''
    },
    wsConnected: false,
    dialog: false,
    subscribeForm: false,
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
    showSubscribeForm(visible) {
      this.subscribeForm = visible || false
    },
    cookieAccept() {
      window.localStorage.setItem('cookiePopup', 'accept')
      this.showCookie = false
    },

	}
})
