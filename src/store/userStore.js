import { defineStore } from "pinia";
import router from "@/router";
import * as api from "@/api";

const localStorageUser = JSON.parse(window.localStorage.getItem('user'))

export const useUserStore = defineStore('user', {
	state: () => ({
		logged: !!localStorageUser,
    // /** @type {{ text: string, id: number, isFinished: boolean }[]} */
		user: localStorageUser || null
	}),
	getters: {
	},
	actions: {
    async signIn(payload) {
      const data = await api.signIn(payload)
      if(data.success) {
        this.logged = true;
        this.user = data.result;
        window.localStorage.setItem('user', JSON.stringify(data.result))
      }
      return data
    },

    async signUp(payload) {
      // return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
      const data = await api.signUp(payload)
      if(data.success) {
        // window.afterSignup = true
      }
      return data
    },

    updateUser(payload) {
      if(!this.logged) return
      this.user = {
        ...this.user,
        ...payload
      };
      window.localStorage.setItem('user', JSON.stringify(this.user))
    },

    async resendConfirmEmail(payload) {
      const data = await api.resendConfirmEmail()
      // if(!data.success && data.error?.code === 'already_confirmed') {
        // commit('updateUser', {status: 1})
      // }
      return data
    },

    logOut() {
      this.logged = false;
      this.user = null
      window.localStorage.removeItem('user');
      return router.replace({name: 'AuthSignIn'})
    },
	}
})
