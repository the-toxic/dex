<template>
  <v-row justify="center" v-show="dialogModel">
    <v-dialog v-model="dialogModel" :width="400" max-width="80%" >
      <v-card tile :loading="loading">
        <v-card-title class="pr-3">Connect your Wallet<v-spacer/>
          <v-btn icon @click="dialogModel = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider/>

        <v-card-text class="pa-6">
          <p class="fs20">Blockchain: Ethereum</p>
          <div v-if="wallet" class="mb-3">
            <h3>Your account is connected.</h3>
            <code>{{ wallet }}</code>
          </div>
          <v-btn block class="myBtn" height="70" v-if="!wallet" @click="connectMetamask" :loading="loading" :disabled="loading"><v-icon left>mdi-wallet-outline</v-icon> Metamask</v-btn>
          <v-btn block class="myGrayBtn" v-if="wallet" @click="disconnectMetamask" :loading="loading" :disabled="loading">Disconnect</v-btn>
        </v-card-text>

        <!--				<v-card-actions>-->
        <!--          <v-spacer></v-spacer>-->
        <!--          <v-btn color="info" text @click="dialogModel = false">Close</v-btn>-->
        <!--				</v-card-actions>-->
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import {connect, disconnect} from "@/helpers/web3"
import {mapGetters} from "vuex"

export default {
  name: "WalletDialog",
  data: () => ({
    loading: false,
  }),
  computed: {
    ...mapGetters({wallet: 'wallet'}),

    dialogModel: {
      get() { return this.$store.getters.walletDialog },
      set(newValue) { this.$store.dispatch('showWalletDialog', newValue) }
    }
  },
  methods: {
    async connectMetamask() {
      this.loading = true
      // await connect()
      await this.$store.dispatch('updateWallet', '0x123456789012345678901234567890')
      this.loading = false
      setTimeout(() => { // fix bug no redirect
        this.dialogModel = false
      }, 1000)
    },
    async disconnectMetamask() {
      this.loading = true
      // await disconnect()
      await this.$store.dispatch('updateWallet', '')
      this.loading = false
    }
  }
}
</script>
