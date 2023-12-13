/// <reference types="vite/client" />

import { VueElement } from "vue";
import { AppLayoutsEnum } from "@/types";

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "vue-router" {
  interface RouteMeta {
    layout?: AppLayoutsEnum;
    layoutComponent?: VueElement;
    needAuth?: boolean
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $clipboard: (text: string, toastText?: string) => void;
  }
}

declare global {
  interface Window {
		initGeetest4: (options: object, callback: (captchaObj) => void) => void,
		captchaObj: {
      getValidate(),
      destroy(),
      showCaptcha(),
      reset()
    }
    tvWidget: {
      onChartReady(cb: any)
      headerReady: Promise
      activeChart: () => {
        setSymbol: (symbol: string) => void,
        priceFormatter: () => any,
        onSymbolChanged()
      },
      remove: () => void
    } | undefined
  }
}

export {}
