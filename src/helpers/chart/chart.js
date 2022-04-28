import Datafeed from "./datafeed";
import store from "@/store";
// import { symbolItemByInfo } from "@/helpers/common";
import { priceFormatter } from "@/helpers/common";

export const initChart = (pairAddr) => {
  window.tvWidget = new TradingView.widget({
    // debug: true,
    // symbol: 'UNKNOWN ROUTER:USDT/WBNB:0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', // default symbol
    symbol: pairAddr,
    symbol_search_request_delay: 1000, // delay before request in search field
    interval: '15', // default interval
    container: 'tv_chart_container',
    datafeed: Datafeed,
    library_path: '/assets/charting_library/',
    // locale: getLanguageFromURL() || 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: 'Dark',
    overrides: {
      volumePaneSize: "medium"
      // "paneProperties.background": "#131722",
      // "paneProperties.vertGridProperties.color": "#363c4e",
      // "paneProperties.horzGridProperties.color": "#363c4e",
      // "symbolWatermarkProperties.transparency": 90,
      // "scalesProperties.textColor" : "#AAA",
      // "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
      // "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
    },
    // studies_overrides: {
      // "volume.volume.color.0": "#00FFFF",
    // },
    // time_frames: [
      // { text: "1w", resolution: "1W", description: "1 Week", title: "1 Week" },
    // ],
    favorites: {
      intervals: ["1", "15", "60", "1D", "1W"],
    },
    fullscreen: false, // displays the chart in the fullscreen mode
    width: '100%',
    height: '800px',
    // autosize: true, // Full size on container
    disabled_features: ['header_compare', 'volume_force_overlay'] // "header_widget", "header_symbol_search", "left_toolbar", "use_localstorage_for_settings", "header_resolutions"
    // enabled_features: [],
    // custom_css_url: 'css/style.css',
  });

  // init chart 25276
  // onChartReady 25409

  tvWidget.onChartReady(() => {
    // tvWidget.activeChart().priceFormatter().format = priceFormatter; // function

    tvWidget.headerReady().then(function() {
      const button = tvWidget.createButton();
      button.textContent = 'Invert Pair'
      button.style.cursor = 'pointer'
      button.classList.add("invertPairBtn")
      button.addEventListener('click', () => {
        alert('In work')
        // tvWidget.activeChart().setSymbol('UNKNOWN ROUTER:USDT/WBNB:0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae:invert')
      });
    });

    tvWidget.activeChart().onSymbolChanged().subscribe(null, (symbolInfo) => {
      // symbolInfo.needInvert = symbolInfo.checkInvert()
      // const symbolItem = symbolItemByInfo(symbolInfo)
      // store.dispatch('chart/setSymbol', symbolItem).then()
    });
  })
  // tvWidget.subscribe('onTick', (candle) => {
  //   console.log('onTick', candle) // time, open, close...
  // })
  // tvWidget.unsubscribe('onTick', (cb) => {})
}




// var o = (() => {
//   return (t = o || (o = {})).FULL = "full", t.EXPANDED = "expanded", o;
//   var t
// })();
//
// function i(...t) {
//   let e = {};
//   for (const n of t)
//     if (n instanceof Array)
//       e instanceof Array || (e = []),
//         e = [...e, ...n];
//     else if (n instanceof Object)
//       for (let [t, o] of Object.entries(n))
//         o instanceof Object && t in e && (o = i(e[t], o)),
//           e = Object.assign(Object.assign({}, e), {
//             [t]: o
//           });
//   return e
// }
// function _displayableNumber(t, e, n, o, a=2, r=30, s=i) {
//   if (n) {
//     if (e.toString().split("e")[1]) return t.toLocaleString(s);
//     {
//       const e = Math.max(0, 6 - n);
//       return (+t.toFixed(e)).toLocaleString(s, {
//         minimumFractionDigits: e < a ? e : a,
//         maximumFractionDigits: e
//       })
//     }
//   }
//   {
//     const e = 0 === t ? 0 : n ? 6 - n : -Math.floor(Math.log(t) / Math.log(10) + 1),
//       i = Math.min(Math.max(e + a + 2, 6), 20),
//       c = (+t.toFixed(Math.max(0, Math.min(i, r)))).toLocaleString(s, {
//         minimumFractionDigits: a,
//         maximumFractionDigits: i
//       });
//     return e < 4 || o ? c : c.slice(0, 3) + "..." + c.slice(-c.length + e)
//   }
// }
// function _displayFull(t, e, n, o=i) {
//   return n && e.toString().split("e")[1] ? toFixed(t) : t.toLocaleString(o, {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 20
//   })
// }
// function toFixed(t)
// {
//   let e = t.toString();
//   if (Math.abs(t) < 1) {
//     const n = parseInt(t.toString().split("e-")[1], 10);
//     n && (t *= Math.pow(10, n - 1), e = "0." + new Array(n).join("0") + t.toString().substring(2))
//   } else {
//     let n = parseInt(t.toString().split("+")[1], 10);
//     n > 20 && (n -= 20, e = (t /= Math.pow(10, n)) + new Array(n + 1).join("0"))
//   }
//   return e
// }
// function toReadableNumber(t, e=null, n=2, a=30) {
//   if (null == t || void 0 === t.length && isNaN(t) || "" === (t + "").trim()) return;
//   const i = Math.floor(+t)
//   const s = (i || "").toString().length;
//   return e === o.FULL ? _displayFull(+t, i, s) : _displayableNumber(+t, i, s, e === o.EXPANDED, n, a)
// }
// function shortPrice(price, e=10) {
//   if (null == price) return "";
//   const n = toReadableNumber(price, null, e);
//   return n && n.indexOf("...") >= 0 ? n.slice(0, e + 2) : n ? n.slice(0, e) : ""
// }
