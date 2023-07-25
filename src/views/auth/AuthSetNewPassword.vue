<template>
  <h3 class="fs24 mb-10">Password Recovery</h3>

  <v-form v-if="!success" ref="form" @submit.prevent="onSubmit">
    <v-text-field label="New Password"
      v-model.trim="form.password"
      name="password" type="password" counter="25"
      :rules="passwordRules"
    />
    <v-text-field label="Repeat new Password"
      v-model.trim="re_new_pass"
      name="re_password" type="password" counter="25"
      :rules="[(form.password === re_new_pass) || 'Password must be match']"
    />
    <v-btn type="submit" block color="primary" class="myBtn text-none" size="large"
       :loading="loading" :disabled="loading">Confirm</v-btn>

    <p class="text-h6 text-center mt-6">I know my password. <router-link :to="{name: 'AuthSignIn'}">Sign In</router-link></p>
  </v-form>

  <div v-if="success" class="text-center">
    <p class="fs25 lh-30 mb-7 white--text">New password has successfully set!</p>
    <v-btn :to="{name: 'AuthSignIn'}" block color="primary" class="myBtn text-none" size="large">Sign In</v-btn>
  </div>
</template>

<script>
import {setNewPassword} from "@/api"
import * as tokenHelper from "@/helpers/jwt_token"
import { passwordRules } from "@/helpers/mixins";
import { mapActions } from "pinia";
import { useMainStore } from "@/store/mainStore";

  export default {
    name: 'AuthSetNewPassword',
    data() {
      return {
        loading: false,
        valid: true,
        success: false,
        form: {
          password: '',
          token: '',
        },
        re_new_pass: ''
      }
    },
    created() {
      // const query = this.$route.query
      // try {
        // if(!query.token || +query.token.length < 32 || +query.token.length > 128) throw new Error('Invalid token')
        // const { payload } = tokenHelper.parseJWT(query.token)
        // if(!payload || !payload.expire || payload.action !== 'recovery') throw new Error('Invalid token [payload]')
        // if(payload.expire < this.nowTimestamp()) throw new Error('Token expired')
      // } catch (e) {
      //   setTimeout(() => this.showAlert(e.message)) // bug on load page, need async
      //   this.$router.replace({name: 'Home'})
      //   return
      // }
      // this.form.token = query.token
    },
    computed: {
      passwordRules() { return passwordRules },
    },
    methods: {
      ...mapActions(useMainStore, {showAlert: 'showAlert'}),
      async onSubmit() {
        const { valid } = await this.$refs.form.validate()
        if(!valid) return false

        this.loading = true
        const {data} = await setNewPassword(this.form)
        this.loading = false

        if(data.success) {
          this.success = true
          await this.$router.replace({ query: null }) // clear token in url
        }
      }
    }
  }
</script>
