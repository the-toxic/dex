import Datafeed from "./datafeed";

export const initChart = () => {
  window.tvWidget = new TradingView.widget({
    // debug: true,
    symbol: 'UNKNOWN ROUTER:USDT/WBNB:0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', // default symbol
    symbol_search_request_delay: 1000, // delay before request in search field
    interval: '15', // default interval
    container: 'tv_chart_container',
    datafeed: Datafeed,
    library_path: '/assets/charting_library/',
    // locale: getLanguageFromURL() || 'en',
    // timezone: 'Europe/Moscow',
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

  // tvWidget.headerReady().then(function() {
  //   const button = tvWidget.createButton();
  //   button.textContent = 'Load WBNB/BUSD';
  //   button.addEventListener('click', function() {
  //     tvWidget.activeChart().setSymbol('PanCake v2:WBNB/BUSD:0x58f876857a02d6762e0101bb5c46a8c1ed44dc16')
  //   });
  // });

  // tvWidget.subscribe('onTick', (candle) => {
  //   console.log('onTick', candle) // time, open, close...
  // })
  // tvWidget.unsubscribe('onTick', (cb) => {})
}
