<template>
  <component :is="route.meta.layoutComponent">
      <router-view />
  </component>

  <Alert />
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  import { useHead } from "@unhead/vue";
  import Alert from "@/components/Alert.vue";

  const route = useRoute()

  useHead({
    templateParams: {
      site: {
        name: 'HAZB',
      },
      separator: '|',
    },
    titleTemplate: '%s %separator %site.name',
    title: 'HAZB - Embrace the future of crypto intelligence today!',
  })
</script>
