<template>

  <v-btn @click="inc">count is: {{ count }}</v-btn>
  <v-btn @click="resetStore">Reset</v-btn>
<!--  <v-btn @click="mainStore.increment">count is: {{ mainStore.count }}</v-btn>-->

</template>

<script>
import { mapStores, mapState, mapActions, mapWritableState } from 'pinia'
import { useMainStore } from "../stores/main";

export default {
  name: 'Test',
  data() {
    return {}
  },
  created() {
    // watch on store
    this.mainStore.$subscribe((mutation, state) => {
      // mutation.type // 'direct' | 'patch object' | 'patch function'
      // mutation.storeId // 'main'
      // mutation.payload // patch object passed to mainStore.$patch()
      console.log(mutation)
    })
  },
  computed: {
    ...mapStores(useMainStore), // allow use "this.mainStore" variable

    ...mapState(useMainStore, ['count']), // disallow mutate
    ...mapWritableState(useMainStore, {writableCount: 'count'}), // allow mutate

    // double: store => store.doubleCount,
    // cnt(store) {
    //   console.log(store)
    //   return store.state
    // }
  },
  methods: {
    ...mapActions(useMainStore, ['resetStore']),
    inc() {
      // this.writableCount++ // direct mutation
      this.mainStore.increment() // direct mutation

      // this.mainStore.$patch(state => { // patch mutation
      //   state.count = state.count + 1
      //   state.users.push(1)
      // })
    }
  }
}
</script>
