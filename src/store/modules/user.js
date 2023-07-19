import router from "@/router"
import * as api from "@/api"
import { resetPassword } from "@/api";

export default {
	namespaced: true,
	state: {
		logged: false,
		user: {}, // user_id, email, token ...
	},
	getters: {
		logged: (state/*, getters, rootState, rootGetters*/) => state.logged,
		user: state => state.user,
		// balance: state => state.user.balance || 0,
		// jwt: state => state.user['jwt'],
		// refresh: state => state.user['refresh']
	},
	mutations: {
		signIn(state, payload) {
			state.logged = true;
			state.user = payload;
			window.localStorage.setItem('user', JSON.stringify(payload))
		},
		updateUser(state, payload) {
			if(!state.logged) return
			state.user = {
				...state.user,
				...payload
			};
			window.localStorage.setItem('user', JSON.stringify(state.user))
		},
		logOut(state) {
			state.logged = false;
			state.user = {}
			window.localStorage.removeItem('user');
		},
		signInWithLocalStorage(state) {
			if(window.localStorage.getItem('user')) {
				state.logged = true;
				state.user = JSON.parse(window.localStorage.getItem('user'));
			}
		}
	},
	actions: {
		async signIn({commit}, payload) {
			const data = await api.signIn(payload)
			if(data.success) {
				commit('signIn', data.result)
			}
			return data
		},

		async signUp({commit}, payload) {
			// return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
			const data = await api.signUp(payload)
			if(data.success) {
				// window.afterSignup = true
				// commit('signIn', data.result)
			}
			return data
		},

		async resendConfirmEmail({commit}, payload) {
			const data = await api.resendConfirmEmail()
			if(!data.success && data.error?.code === 'already_confirmed') {
				// commit('updateUser', {status: 1})
			}
			return data
		},

		logOut({commit}) {
			commit('logOut');
			return router.replace({name: 'AuthSignIn'})
		},
	}
}
