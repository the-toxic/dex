<template>
  <component :is="route.meta['layoutComponent']">
      <router-view />
  </component>
</template>

<script setup>
  import { useRoute } from "vue-router";
  const route = useRoute()
</script>
