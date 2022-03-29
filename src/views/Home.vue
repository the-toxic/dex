<template>
  <h1 class="text-center text-h2 mt-8">Home</h1>
  <div class="text-center mt-8">
    <v-btn :to="{name: 'Pairs'}">Explore pairs</v-btn>
  </div>
</template>
<script>
export default {
  name: 'Home'
}
</script>