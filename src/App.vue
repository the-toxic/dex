<template>
  <component :is="route.meta['layoutComponent']">
      <router-view />
  </component>

  <Alert />
</template>

<script setup>
  import { useRoute } from "vue-router";
  import Alert from "@/components/Alert.vue";
  const route = useRoute()
</script>
