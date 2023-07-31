<template>
  <v-container>
    <h1 class="text-h4 mt-6 mb-6">Profile</h1>
    <v-card :loading="loading">
      <v-card-title>Information about user</v-card-title>
      <v-divider/>
      <v-card-text class="px-10 py-10">
        <v-responsive class="" max-width="344">

          <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
            <v-text-field label="Email" :model-value="user?.email" readonly variant="solo-filled"></v-text-field>
            <v-text-field label="Password" type="password" model-value="12345678" readonly variant="solo-filled">
              <template v-slot:append-inner>
                <v-btn rounded color="secondary" size="small" class="text-none">
                  Change <PasswordModal />
                </v-btn>
              </template>
            </v-text-field>
            <v-text-field label="First name" :model-value="form.first_name"></v-text-field>
            <v-text-field label="Last name" :model-value="form.last_name"></v-text-field>
            <v-text-field label="Discord" :model-value="form.discord"></v-text-field>
            <v-text-field label="Telegram" :model-value="form.telegram"></v-text-field>
            <v-btn type="submit" color="primary" block size="large" class="text-none">Save</v-btn>
          </v-form>

        </v-responsive>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/store/userStore";
import PasswordModal from "@/components/PasswordModal.vue";
import { updateProfile } from "@/api";
import { useMainStore } from "@/store/mainStore";

export default {
  name: 'Profile',
  components: { PasswordModal },
  data: () => ({
    loading: false,
    valid: true,
    form: {
      first_name: '',
      last_name: '',
      discord: '',
      telegram: '',
    }
  }),
  computed: {
    ...mapState(useUserStore, {user: 'user'})
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return

      this.loading = true
      const { data } = await updateProfile(this.form)
      this.loading = false

      if(data.success) {
        this.showAlert({msg: 'Successfully saved', color: 'success'})
      }
    }
  }
}
</script>
