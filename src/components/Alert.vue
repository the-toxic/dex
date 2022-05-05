<template>
  <v-snackbar tile
    v-show="isVisible" v-model="isVisible"
    right top
    timeout="-1"
    :class="{
      'successShadow': color === 'success',
      'errorShadow': color === 'error',
    }"
    color="#1D2231"
  >
    <v-icon left color="#A8A8A8" v-if="color === 'success'">mdi-check-bold</v-icon>
    <v-icon left color="#A8A8A8" v-else-if="color === 'error'">mdi-alert-remove</v-icon>
    <v-icon left color="#A8A8A8" v-else-if="color === 'info'">mdi-message-alert-outline</v-icon>
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn icon color="#A8A8A8" v-bind="attrs" @click="isVisible = false"><v-icon>mdi-close</v-icon></v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Alert",
  data: () => ({
    isVisible: false
  }),
  computed: {
    message() {
      return this.$store.state.alert.msg
    },
    color() {
      return this.$store.state.alert.color
    }
  },
  watch: {
    message(val) {
      this.isVisible = !!val
    }
  }
}
</script>

<style lang="scss">
.v-snack__wrapper {
  border: 1px solid transparent !important;
  box-shadow: 2px 2px 0 0 #FFE350 !important;
  .successShadow & { box-shadow: 2px 2px 0 0 #85DF77 !important; }
  .errorShadow & { box-shadow: 2px 2px 0 0 #FF1616 !important; }
}
</style>