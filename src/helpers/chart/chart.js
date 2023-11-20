import Datafeed from "./datafeed.js";
import { formatNumber } from "@/helpers/mixins";
// import { symbolItemByInfo } from "@/helpers/common";

export const initChart = (pairAddr) => {
  window.tvWidget = new TradingView.widget({
    // debug: true,
    // symbol: 'UNKNOWN ROUTER:USDT/WBNB:0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', // default symbol
    symbol: pairAddr,
    interval: '15', // default interval
    container: 'tv_chart_container',
    datafeed: Datafeed,
    library_path: '/assets/charting_library/',
    // locale: getLanguageFromURL() || 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: 'Dark',
    toolbar_bg: "#18181F",
    custom_css_url: 'customTWStyles.css',
    loading_screen: {
      backgroundColor: "transparent",
    },
    // symbol_search_request_delay: 1000, // delay before request in search field
    overrides: {
      volumePaneSize: "small",
      "paneProperties.background": "#18181F",
      "paneProperties.horzGridProperties.color": "#18181F",
      "paneProperties.legendProperties.showSeriesOHLC": false, // not work
      "paneProperties.backgroundType": "solid",
      // "paneProperties.backgroundGradientStartColor": "#020024",
      // "paneProperties.backgroundGradientEndColor": "#4f485e",
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
    time_frames: [
    //   { text: "1M", resolution: "1H", description: "1 Month range on 1H candles", title: "1 Month range" },
    //   { text: "1Y", resolution: "1D", description: "1 Year range on 1D candles", title: "1 Year range" }
    ],
    favorites: {
      intervals: ["1", "15", "60", "1D"], // "1W"
    },
    fullscreen: false, // displays the chart in the fullscreen mode
    width: '100%',
    height: '100%',
    // autosize: true, // Full size on container
    disabled_features: ['use_localstorage_for_settings', 'header_symbol_search', 'header_compare', 'volume_force_overlay', 'display_market_status'], // "go_to_date", "header_widget", "header_symbol_search", "left_toolbar", "use_localstorage_for_settings", "header_resolutions"
    // enabled_features: [
    //   'show_symbol_logos', // add in ver 25.001
    //   'show_symbol_logo_in_legend', // add in ver 26
    //   'show_exchange_logos', // add in ver 25.001
    // ],
    // custom_css_url: 'css/style.css',
    time_scale: {
      min_bar_spacing: 5, // block micro zoom
    }
  });

  tvWidget.onChartReady(() => {
    tvWidget.activeChart().priceFormatter().format = formatNumber; // function

    tvWidget.headerReady().then(function() {
      // const button = tvWidget.createButton();
      // button.textContent = 'Invert Pair'
      // button.style.cursor = 'pointer'
      // button.classList.add("invertPairBtn")
      // button.addEventListener('click', () => {
      //   tvWidget.activeChart().setSymbol(tvWidget.activeChart().symbol() + ':invert')
      //   tvWidget.activeChart().resetData()
      // });
    });

    // Вызывается только при ручном выборе пары через поиск
    tvWidget.activeChart().onSymbolChanged().subscribe(null, (symbolInfo) => {
      tvWidget.activeChart().priceFormatter().format = formatNumber;
      // symbolInfo.needInvert = symbolInfo.checkInvert()
      // const symbolItem = symbolItemByInfo(symbolInfo)
      // store.dispatch('chart/setActiveSymbol', symbolItem).then()
    });

    // let f = () => { console.log('bars loaded'); };
    // let subsr = tvWidget.activeChart().onDataLoaded();
    // subsr.subscribe(null, f, false)
    // subsr.unsubscribe(null, f)
  })
  // tvWidget.subscribe('onTick', (candle) => {
  //   console.log('onTick', candle) // time, open, close...
  // })
  // tvWidget.unsubscribe('onTick', (cb) => {})
}

// export const showChartSearch = () => {
//   window.tvWidget.activeChart().executeActionById('symbolSearch');
// }
