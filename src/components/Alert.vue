<template>
  <v-snackbar app tile theme="light"
    v-model="isVisible"
    location="top right"
    timeout="-1"
    :class="{
      'successShadow': color === 'success',
      'errorShadow': color === 'error',
    }"
    color="#1D2231"
  >
  <!-- v-show="isVisible" -->
    <v-icon left color="#A8A8A8" v-if="color === 'success'">mdi-check-bold</v-icon>
    <v-icon left color="#A8A8A8" v-else-if="color === 'error'">mdi-alert-remove</v-icon>
    <v-icon left color="#A8A8A8" v-else-if="color === 'info'">mdi-message-alert-outline</v-icon>
    {{ message }}
    <template v-slot:actions>
      <v-btn icon color="#A8A8A8" @click="isVisible = false"><v-icon>mdi-close</v-icon></v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
  name: "Alert",
  data: () => ({
    isVisible: false
  }),
  computed: {
    ...mapState(useMainStore, ["alert"]),
    message() {
      return this.alert.msg
    },
    color() {
      return this.alert.color
    },
  },
  watch: {
    message(val) {
      this.isVisible = !!val
    }
  }
}
</script>

<style lang="scss">
.v-snackbar__wrapper {
  border: 1px solid transparent !important;
  box-shadow: 2px 2px 0 0 #FFE350 !important;
  .successShadow & { box-shadow: 2px 2px 0 0 #85DF77 !important; }
  .errorShadow & { box-shadow: 2px 2px 0 0 #FF1616 !important; }
}
.v-snackbar__content i { vertical-align: bottom }
</style>
