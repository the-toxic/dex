<template>
  <v-dialog v-model="dialog" activator="parent" max-width="400px">
    <v-card class="myCard2" :loading="loading">
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">

        <v-card-title class="thirtyFont mb-3 pt-7" style="font-size: 25px;">Change Password</v-card-title>
        <v-card-text>
          <v-text-field label="Old Password"
            v-model="form.old_password" type="password" class="mb-2"
            :rules="[v => !!v || 'Required field']" counter>
          </v-text-field>

          <v-text-field label="New Password"
            v-model="form.new_password"
            :append-inner-icon="isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShowPass ? 'text' : 'password'"
            @click:append-inner="isShowPass = !isShowPass"
            :rules="passwordRules" class="mb-2"
            hint="At least 8 characters" counter
          ></v-text-field>

          <v-text-field label="Repeat new Password"
            v-model="re_new_pass"
            type="password" counter
            :rules="[(form.new_password === re_new_pass) || 'Password must be match']"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false" color="disabled">Close</v-btn>
          <v-btn type="submit" variant="text" color="secondary" :loading="loading" :disabled="loading">Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { changePassword } from "@/api";
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";
import { passwordRules } from "@/helpers/mixins";

export default {
  name: "PasswordModal",
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      valid: true,
      isShowPass: false,
      form: {
        old_password: '',
        new_password: '',
      },
      re_new_pass: '',
    }
  },
  computed: {
    passwordRules() { return passwordRules},
  },
  methods: {
    ...mapActions(useMainStore, {showAlert: 'showAlert'}),

    async onSubmit() {
      const { valid } = await this.$refs.form.validate()
      if(!valid) return false

      this.loading = true
      const { data } = await changePassword(this.form)
      this.loading = false

      if(data.success) {
        this.dialog = false
        this.showAlert({msg: 'Password successfully changed', color: 'success'})
      }
    }
  }
}
</script>
