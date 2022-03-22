import { defineStore } from 'pinia'

// interface State { // TS
//   firstName: string
//   lastName: string
//   userId: number | null
// }

export const useMainStore = defineStore('main', { // With default suffix store name - mainStore
  state: () => ({
    count: 0,
    users: []
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    /** @returns {number} */
    doubleCountPlusOne() { return this.doubleCount + 1 },
    getUserById: (state) => (userId) => state.users.find((user) => user.id === userId),
  },
  actions: {
    increment(payload) {
      this.count++
    },
    resetStore () {
      this.$reset()
    }
  }
})
