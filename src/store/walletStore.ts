import { defineStore } from "pinia";

function updateLocalStorage(data: any) {
  const wallet = JSON.parse(window.localStorage.getItem('wallet') as string);
  window.localStorage.setItem('wallet', JSON.stringify({...wallet, ...data}))
}

const localStorageWallet = JSON.parse(window.localStorage.getItem('wallet') as string)

export const useWalletStore = defineStore('wallet', {
	state: () => ({
    sign_phrase: localStorageWallet?.sign_phrase || '', // fill after sign request
    account: localStorageWallet?.account || '',
    // jwt: '',
    // refresh: '',
    // expired: null,
    providerName: localStorageWallet?.providerName || ''
  }),

	getters: {
    // sign_phrase: state => state.sign_phrase,
    // account: state => state.account,
    // jwt: state => state.jwt,
    // expired: state => state.expired,
    // providerName: state => state.providerName
	},

	actions: {
    async login(payload: any) {
      this.account = payload.account
      // this.jwt = payload.jwt
      // this.refresh = payload.refresh
      // this.expired = payload.expired
      this.providerName = payload.providerName
      window.localStorage.setItem('wallet', JSON.stringify(payload))
    },
    async sign(payload: string) {
      this.sign_phrase = payload
      updateLocalStorage({sign_phrase: payload})
    },
    logOut(needReload = true) {
      this.sign_phrase = ''
      this.account = ''
      // this.jwt = ''
      // this.refresh = ''
      // this.expired = null
      this.providerName = ''
      window.localStorage.removeItem('wallet')

      if(needReload) {
        // if(window.location.pathname.includes('mint')) {
        window.location.reload()
        // }
        // window.location = '/'
      }
    },
	}
})
