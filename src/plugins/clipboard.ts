import { useMainStore } from "@/store/mainStore";
import { App } from "vue";
const mainStore = () => useMainStore()

export function initClipboard(app: App) {
  /**
   * Copy to clipboard the text passed
   * @param {String} text string to copy
   * @param {String} toastText message to appear on the toast notification
   */
  app.config.globalProperties.$clipboard = (text: string, toastText: string | undefined = 'Copied to clipboard!') => {
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
