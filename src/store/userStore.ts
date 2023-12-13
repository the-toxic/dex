import { defineStore } from "pinia";
import router from "@/router";

const localStorageUser = JSON.parse(window.localStorage.getItem('user') as string)

export const useUserStore = defineStore('user', {
	state: () => ({
		logged: !!localStorageUser,
    // /** @type {{ jwt: string, refresh: string, id: string, email: string ... }} */
		user: localStorageUser || null
	}),
	getters: {
    // token: (state) => state.user.token
	},
	actions: {
    logIn(payload: any) {
      if(!['access_token', 'refresh_token', 'user'].every(key => key in payload)) {
        console.log('Invalid params for logIn'); return false
      }
      this.logged = true;
      payload.user.jwt = payload['access_token']
      payload.user.refresh = payload['refresh_token']
      this.user = payload.user;
      window.localStorage.setItem('user', JSON.stringify(this.user))
      return true
    },

    updateUser(payload: any) {
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
