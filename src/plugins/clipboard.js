import Vue from 'vue'

/**
 * Copy to clipboard the text passed
 * @param {String} text string to copy
 * @param {String} toastText message to appear on the toast notification
 */
Vue.prototype.$clipboard = function (text, toastText = 'Copied to clipboard!') {
  const el = document.createElement('textarea')

  try {
    navigator.clipboard.writeText(text).then();
  } catch (e) {
    // For old browsers
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('Copy')
    document.body.removeChild(el)
  }

  if (this.$store && this.$store.dispatch)
    this.$store.dispatch('showAlert', {msg: toastText, color: 'success'}).then()
}
