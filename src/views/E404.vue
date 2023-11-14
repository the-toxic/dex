<template>
  <v-container class="d-flex align-center justify-center" style="height: 100vh">
    <v-card class="w-100" style="max-width: 400px">
      <v-card-text class="text-center">
        <h1 class="text-h1 text-amber my-5">404</h1>
        <h1 class="text-h4 my-5">Page not found</h1>
        <v-btn :to="{name: 'Home'}" color="amber" variant="outlined" size="large" class="my-5">Home</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
