<template>
  <v-container>
    <h1 class="text-h4 mt-6 mb-6">Profile</h1>
    <v-card :loading="loading" class="mb-6">
      <v-card-title>Information about user</v-card-title>
      <v-divider/>
      <v-card-text class="px-10 py-10">
        <v-responsive class="" >

          <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="Email" :model-value="user?.email" readonly variant="solo-filled" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Password" type="password" model-value="12345678" readonly variant="solo-filled" hide-details="auto">
                <template v-slot:append-inner>
                  <v-btn rounded color="secondary" size="small" class="text-none">
                    Change <PasswordModal />
                  </v-btn>
                </template>
              </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="First name" v-model="form.first_name" :rules="nameRules" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Last name" v-model="form.last_name" :rules="nameRules" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Discord" v-model="form.discord" :rules="[v => (v.length <= 64) || 'Max length 64 chars']" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Telegram" v-model="form.telegram" :rules="[v => (v.length <= 64) || 'Max length 64 chars']" hide-details="auto"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox v-model="form.newsletters" label="Do you wanna receive marketing emails?" :true-value="true" :false-value="false" density="compact" hide-details />
              </v-col>
            </v-row>
            <v-btn type="submit" color="primary" block size="large" class="text-none mt-5">Save</v-btn>
          </v-form>
        </v-responsive>
      </v-card-text>
    </v-card>

    <v-card class="mb-6">
      <v-card-title>Delete Account</v-card-title>
      <v-divider/>
      <v-card-text class="d-flex px-10 pt-8 pb-10">
        <v-checkbox v-model="deleteCheckbox" label="I confirm that I want to delete my account. This action cannot by undone!" :true-value="true" :false-value="false" density="compact" hide-details />
        <v-spacer />
        <v-btn color="red" :disabled="!deleteCheckbox" class="text-none">Delete Account
          <v-dialog v-model="dialogDelete" activator="parent" max-width="500px">
              <v-card>
								<v-card-text class="text-center py-16 px-10">
									<p class="mb-6">YOUR DATA WILL BE DELETED.<br>DELETION CANNOT BE UNDONE.</p>
									<div class="d-flex justify-center align-center">
										<v-btn color="red" @click="deleteAccount" class="mr-6">Delete Account</v-btn>
										<v-btn color="white" @click="dialogDelete = false" class="text-none">Cancel</v-btn>
									</div>
								</v-card-text>
              </v-card>
          </v-dialog>
        </v-btn>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/store/userStore";
import PasswordModal from "@/components/PasswordModal.vue";
import { deleteAccount, updateProfile } from "@/api";
import { useMainStore } from "@/store/mainStore";
import { nameRules } from "@/helpers/mixins";

export default {
  name: 'Profile',
  components: { PasswordModal },
  head: { title: {inner: 'Profile', complement: import.meta.env.VITE_APP_PROJECT_NAME}},
  data() { return {
    loading: false,
    valid: true,
    form: {
      first_name: '',
      last_name: '',
      discord: '',
      telegram: '',
      newsletters: false
    },
    deleteCheckbox: false,
		dialogDelete: false
  }},
  created() {
    this.form.first_name = this.user.first_name || ''
    this.form.last_name = this.user.last_name || ''
    this.form.discord = this.user.discord || ''
    this.form.telegram = this.user.telegram || ''
    this.form.newsletters = this.user.newsletters || false
  },
  computed: {
    ...mapState(useUserStore, {user: 'user'}),
    nameRules() { return nameRules }
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),
    ...mapActions(useUserStore, {updateUser: 'updateUser', logOut: 'logOut'}),

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
    },
    async deleteAccount() {
      const { data } = await deleteAccount()
      if(data.success) {
				this.showAlert({msg: 'Account successfully deleted', color: 'success'})
        await this.logOut()
      }
    }
  }
}
</script>
