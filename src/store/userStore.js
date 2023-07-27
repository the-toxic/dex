import { defineStore } from "pinia";
import router from "@/router";

const localStorageUser = JSON.parse(window.localStorage.getItem('user'))

export const useUserStore = defineStore('user', {
	state: () => ({
		logged: !!localStorageUser,
    // /** @type {{ token: string, id: string, email: string }} */
		user: localStorageUser || null
	}),
	getters: {
    // token: (state) => state.user.token
	},
	actions: {
    logIn(payload) {
      if(!('email' in payload)) {
        console.log('Invalid user Object')
        return
      }
      this.logged = true;
      this.user = payload;
      window.localStorage.setItem('user', JSON.stringify(payload))
      return true
    },

    updateUser(payload) {
      if(!this.logged) return
      this.user = {
        ...this.user,
        ...payload
      };
      window.localStorage.setItem('user', JSON.stringify(this.user))
    },

    logOut() {
      this.logged = false;
      this.user = null
      window.localStorage.removeItem('user');
      return router.replace({name: 'AuthSignIn'})
    },
	}
})
