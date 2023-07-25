import { useMainStore } from "@/store/mainStore";
const mainStore = () => useMainStore()

export function initClipboard(app) {
  /**
   * Copy to clipboard the text passed
   * @param {String} text string to copy
   * @param {String} toastText message to appear on the toast notification
   */
  app.config.globalProperties.$clipboard = function (text, toastText = 'Copied to clipboard!') {
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
    mainStore().showAlert({msg: toastText, color: 'success'})
  }
}
