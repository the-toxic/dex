<template>
  <v-container>
    <h1 class="text-h4 mt-6 mb-6">Contact Us</h1>
    <v-card :loading="loading">
      <v-card-title>If you have any questions, please contact us</v-card-title>
      <v-divider/>
      <v-card-text class="px-10 py-10">
        <v-responsive class="" max-width="344">

          <v-form v-if="!complete" ref="form" v-model="valid" @submit.prevent="onSubmit">
            <v-text-field label="First name" v-model="form.first_name" :rules="nameRules" class="mb-2"></v-text-field>
            <v-text-field label="Last name" v-model="form.last_name" :rules="nameRules" class="mb-2"></v-text-field>
            <v-text-field label="Email" v-model="form.email" :rules="emailRules" class="mb-2"></v-text-field>
            <v-text-field label="Discord" v-model="form.discord" :rules="[v => (v.length <= 64) || 'Max length 64 chars']" class="mb-2"></v-text-field>
            <v-text-field label="Telegram" v-model="form.telegram" :rules="[v => (v.length <= 64) || 'Max length 64 chars']" class="mb-2"></v-text-field>
            <v-textarea label="Message" rows="3" v-model="form.message" :rules="[v => (v.length >= 5) || 'Min length 5 chars']" class="mb-2"></v-textarea>
            <v-btn type="submit" color="primary" block size="large" class="text-none">Send</v-btn>
          </v-form>

          <v-alert v-else color="success" >Your message successfully send!</v-alert>

        </v-responsive>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";
import { emailRules, nameRules } from "@/helpers/mixins";

export default {
  name: 'ContactUs',
  head: () => ({ title: 'Contact Us' }),
  data() { return {
    loading: false,
    valid: true,
    complete: false,
    form: {
      first_name: '',
      last_name: '',
      email: '',
      message: '',
      discord: '',
      telegram: '',
    }
  }},
  computed: {
    nameRules() { return nameRules },
    emailRules() { return emailRules },
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return

      this.loading = true
      const { data } = { data: { success: true } } // await contactUs(this.form)
      this.loading = false

      if(data.success) {
        this.complete = true
        // this.showAlert({msg: 'Successfully send', color: 'success'})
      }
    }
  }
}
</script>
