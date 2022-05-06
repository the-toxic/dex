<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <span v-on="on" @click.stop.prevent="copy">
        <v-icon v-if="icon" size="14" :color="iconColor">mdi-content-copy</v-icon>
        <span v-else>{{ visibleText }}</span>
      </span>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
/*
|---------------------------------------------------------------------
| Copy Label Component
|---------------------------------------------------------------------
|
| Copy to clipboard with the plugin clipboard `this.$clipboard`
|
*/
export default {
  props: {
    // Text to copy to clipboard
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: Boolean,
      default: false
    },
    iconColor: {
      type: String,
      default: '#FFF'
    },
    // Text to show on toast
    alertText: {
      type: String,
      default: 'Copied to clipboard!'
    },
    strip: {
      type: Boolean,
      default: false
    },
    animation: {
      type: String,
      default: 'heartBeat'
    }
  },
  data() {
    return {
      tooltip: 'Copy',
      timeout: null
    }
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  computed: {
    visibleText() {
      return this.strip ? this.text.substr(0, 6) + '...' : this.text
    }
  },
  methods: {
    copy() {
      this.$clipboard(this.text, this.alertText)
      this.tooltip = 'Copied!'

      this.timeout = setTimeout(() => {
        this.tooltip = 'Copy'
      }, 2000)
    }
  }
}
</script>

<style>
/*.copylabel {*/
/*  cursor: pointer;*/
/*  display: inline-block;*/
/*  border-bottom: 1px dashed;*/
/*}*/
</style>
