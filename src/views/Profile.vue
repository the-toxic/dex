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
            <v-text-field label="First name" v-model="form.first_name" :rules="nameRules" class="mb-2"></v-text-field>
            <v-text-field label="Last name" v-model="form.last_name" :rules="nameRules" class="mb-2"></v-text-field>
            <v-text-field label="Discord" v-model="form.discord" :rules="[v => (v.length <= 64) || 'Max length 64 chars']" class="mb-2"></v-text-field>
            <v-text-field label="Telegram" v-model="form.telegram" :rules="[v => (v.length <= 64) || 'Max length 64 chars']" class="mb-2"></v-text-field>
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
import { nameRules } from "@/helpers/mixins";

export default {
  name: 'Profile',
  components: { PasswordModal },
  data() { return {
    loading: false,
    valid: true,
    form: {
      first_name: '',
      last_name: '',
      discord: '',
      telegram: '',
    }
  }},
  created() {
    this.form.first_name = this.user.first_name || ''
    this.form.last_name = this.user.last_name || ''
    this.form.discord = this.user.discord || ''
    this.form.telegram = this.user.telegram || ''
  },
  computed: {
    ...mapState(useUserStore, {user: 'user'}),
    nameRules() { return nameRules }
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),
    ...mapActions(useUserStore, {updateUser: 'updateUser'}),

    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return

      this.loading = true
      const { data } = await updateProfile(this.form)
      this.loading = false

      if(data.success) {
        this.updateUser({...this.form})
        this.showAlert({msg: 'Successfully saved', color: 'success'})
      }
    }
  }
}
</script>
