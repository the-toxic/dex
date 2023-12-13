<template>
  <v-tooltip location="end" :text="tooltip">
    <template v-slot:activator="{ props }">
      <span v-bind="props" @click.stop.prevent="copy">
        <v-icon v-if="icon" size="14" :color="iconColor">mdi-content-copy</v-icon>
        <span v-else>{{ visibleText }}</span>
      </span>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
/*
|---------------------------------------------------------------------
| Copy Label Component
|---------------------------------------------------------------------
|
| Copy to clipboard with the plugin clipboard `this.$clipboard`
|
*/
import { defineComponent } from "vue";

export default defineComponent({
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
      timeout: 0
    }
  },
  beforeUnmount() {
    if(this.timeout) clearTimeout(this.timeout)
  },
  computed: {
    visibleText() {
      return this.strip ? this.text.slice(0, 6) + '...' : this.text
    }
  },
  methods: {
    copy() {
      this.$clipboard(this.text, this.alertText)
      this.tooltip = 'Copied!'

      this.timeout = window.setTimeout(() => {
        this.tooltip = 'Copy'
      }, 2000)
    }
  }
})
</script>

<style>
/*.copylabel {*/
/*  cursor: pointer;*/
/*  display: inline-block;*/
/*  border-bottom: 1px dashed;*/
/*}*/
</style>
