import { fetchHistoryCandles, searchPair } from '@/api'
import { subscribeOnStream, unsubscribeFromStream } from './streaming';
import { useChartStore } from "@/store/chartStore";
import { useMainStore } from "@/store/mainStore";
import { needInvert, shortAddress } from "@/helpers/mixins";
import { ChartSymbol, StreamingBar } from "@/types";

const chartStore = () => useChartStore()
const mainStore = () => useMainStore()

// chartStore().$subscribe((mutation, state) => {
//   console.log('chartStore subscribe', mutation.events.key, mutation.events.newValue, mutation.events.oldValue/*, state*/)
// })

const lastBarsCache = new Map();

// let findedPairs = [
//   {
//   symbol: 'TANK/BUSD', // XMR/BTC - short symbol name
//   full_name: 'Exchange:Symbol:Address'
//   pair_id: 5787,
//   pair_addr: '0x0...'
//   exchange: 'PanCake v2', // Binance - symbol exchange name
//   exchange_id: 11,
//   need_invert: false,
//   chain_id: 1 // 1 - eth, 2 - bsc
//   type: 'BSC', // As example Network name, or stock | "futures" | "crypto" | "forex" | "index" | any custom string
//   description: '', // require for initial load page, or library show full_name
//   tx_count: 111
// }
// ]

async function loadDefaultPair(symbolFullName: string) {
  const {success, result} = await searchPair( { search: symbolFullName, exchange: '', network: '' })
  if(success && result?.content && result.content.length && result.content.some(i => i.pair_addr === symbolFullName)) {
    fillSimilarityPools(result.content)
    const fullName = chartStore().similarityPools.find((i => i.pair_addr === symbolFullName))?.full_name
    window.tvWidget?.activeChart().setSymbol(fullName+'^'+Math.random()) // disable cache
  } else {
    mainStore().showAlert({msg: 'Error. Pair not found', color: 'error'})
    // location.href = '/home?msg=pair404'
  }
}

const configurationData = {
  supported_resolutions: ['1', '5', '10', '15', '30', '60', '180', '720', '1D'], // 1W
  // exchanges: [
  //   { value: '', name: 'All', desc: 'All DEX' },
  //   { value: 'PanCake v2', name: 'PanCake v2', desc: 'Pancake DEX' },
  //   { value: 'Uniswap V2 Router 01', name: 'Uniswap V2 Router 01', desc: 'Uniswap DEX' },
  //   { value: 'Uniswap V2 Router 02', name: 'Uniswap V2 Router 02', desc: 'Uniswap DEX' },
  //   { value: 'Uniswap V3 Router 01', name: 'Uniswap V3 Router 01', desc: 'Uniswap DEX' },
  //   { value: 'Uniswap V3 Router 02', name: 'Uniswap V3 Router 02', desc: 'Uniswap DEX' },
  //   { value: 'SushiSwap', name: 'SushiSwap', desc: 'SushiSwap DEX' },
  //   { value: 'ShibaSwap', name: 'ShibaSwap', desc: 'ShibaSwap DEX' },
  //   { value: 'KyberSwap', name: 'KyberSwap', desc: 'KyberSwap DEX' },
  //   { value: 'MintySwap', name: 'MintySwap', desc: 'MintySwap DEX' },
  //   { value: 'SafeMoon Swap', name: 'SafeMoon Swap', desc: 'SafeMoon Swap DEX' },
  //   { value: 'Swapr', name: 'Swapr', desc: 'Swapr DEX' },
  // ],
  // symbols_types: [{
  //     name: 'All Networks',
  //     value: '', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
  //   }, {
  //     name: 'Binance Smart Chain',
  //     value: 'BSC', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
  //   }, {
  //     name: 'Ethereum',
  //     value: 'Ethereum',
  // }],
};

const humanDate = (date: number) => new Date(date * 1000).toISOString().slice(0, 16)

function fillSimilarityPools(data: ChartSymbol[]) {
  data.forEach(i => {
    // trim exchange name
    if(i.exchange.slice(-6) === 'Router') {
      i.exchange = i.exchange.substring(0, i.exchange.length - 7)
    }
    i.full_name = `${i.exchange}:${i.symbol}:${i.pair_addr}`
    i.description = `${i.symbol} | ${i.exchange} | ${i.type} | ${shortAddress(i.pair_addr)}`

    const [token0, token1] = i.symbol.split('/')
    if(needInvert(token0, token1)) {
      if(!i.need_invert) console.warn('BACKEND SEND INVALID `need_invert` IN /search_pair')
      i.need_invert = true
      i.symbol = `${token1}/${token0}`
    }
    // i.logo_urls = ['https://s2.coinmarketcap.com/static/img/coins/64x64/16447.png', 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png'] // pairInfo.token0.icon // add in ver 25.002
    // i.exchange_logo = 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png' // for search dialog; add in ver 25.002
  })
  data.sort((a,b) => { // filter by TX count, DESC
    if(a.tx_count > b.tx_count) return -1
    if(a.tx_count < b.tx_count) return 1
    return 0
  })

  chartStore().similarityPools = [...data]

}

export default {
  onReady: (callback: (configurationData: object) => void) => {
    // console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData), 0);
  },

  // searchSymbols: async (
  //   userInput, // search text
  //   exchange, // Bitfinex
  //   symbolType, // 'ctypto'
  //   onResultReadyCallback,
  // ) => {
  //   console.log('[searchSymbols]: Method call', userInput, exchange, symbolType);
  //   const {success, result} = await searchPair({
  //     search: userInput,
  //     exchange: exchange,
  //     network: symbolType
  //   });
  //   if(!success || !('content' in result)) {
  //     onResultReadyCallback([]);
  //     return
  //   }
  //
  //   fillSimilarityPools(result.content)
  //
  //   onResultReadyCallback(result.content);
  // },

  resolveSymbol: async (
    symbolFullName: string,
    onSymbolResolvedCallback: (symbolInfo: object) => void,
    onResolveErrorCallback: (error: string) => void,
  ) => {
    console.log('[resolveSymbol]: Method call', symbolFullName);
    symbolFullName = symbolFullName.split('^')[0] as string // disable cache

    if(!chartStore().similarityPools.length) {
      await loadDefaultPair(symbolFullName)
      return;
    } // on load page get default pair

    const symbolItem = chartStore().similarityPools.find(({full_name}) => full_name === symbolFullName);

    if (!symbolItem) {
      // console.warn('similarityPools not found, fetch new', symbolFullName)
      await loadDefaultPair(symbolFullName) // on change pair
      // console.log('[resolveSymbol]: Cannot resolve symbol', symbolFullName);
      // onResolveErrorCallback('cannot resolve symbol');
      return;
    }

    if(chartStore().activeSymbol && chartStore().activeSymbol?.pair_addr === symbolFullName) return // end double call

    chartStore().setActiveSymbol(symbolItem).then()

    const symbolInfo = {
      name: symbolItem.symbol,
      ticker: symbolItem.full_name,
      full_name: symbolItem.full_name, // self adding for show pair address in getBars
      description: symbolItem.description, // выводится рядом с зеленой иконкой коннекта
      type: symbolItem.type,
      chain_id: symbolItem.chain_id,
      pair_id: symbolItem.pair_id,
      pair_addr: symbolItem.pair_addr,
      exchange: 'HAZB.COM', // symbolItem.exchange,
      exchange_id: symbolItem.exchange_id,
      tx_count: symbolItem.tx_count,
      need_invert: symbolItem.need_invert,
      session: '24x7',
      timezone: 'Etc/UTC',
      minmov: 1, // формат цены
      pricescale: 10000000000, // формат цены. 100 - 2 символа после запятой, 1000 - 3 символа
      has_intraday: true, // включение минутных свечей, но надо сконфигурировать
      intraday_multipliers: ['1', '5', '15', '30', '60', '180', '720'], // указанные интервалы будут генерить запросы в БД, все остальные будут автоматом генериться либой на основе более, например 5-минутка будет складываться из 5 минутных баров
      has_daily: true,
      has_weekly_and_monthly: false, // если false то либа сама построит соответствующие разрешения по дневным барам, иначе будет генерить запросы
      // weekly_multipliers: ['1'], // если либа генерит сама, и в разрешениях есть 2 недели, она будет сама складывать 2 бара по 1 неделе
      // monthly_multipliers: ['1'],
      has_empty_bars: true,
      supported_resolutions: configurationData.supported_resolutions,
      visible_plots_set: 'ohlcv', // Support: open, high, low, close. With 'value': "ohlcv"
      // volume_precision: 2, // кол-во десятичных символов в объеме
      data_status: 'streaming', // streaming | endofday | pulsed | delayed_streaming

      // logo_urls: ['imgSrc'], // add in ver 25.002
    };

    // symbolInfo.checkInvert = function () {
    //   const detectStablecoin = this.name.match(/BUSD|TUSD|USDT|USDC|DAI|USD|UST/)
    //   return detectStablecoin && detectStablecoin.index === 0
    // }
    // symbolInfo.needInvert = symbolItem.needInvert = symbolInfo.checkInvert() // on first load symbol

    console.log('[resolveSymbol]: Symbol resolved', symbolFullName);

    setTimeout(() => onSymbolResolvedCallback(symbolInfo))
  },

  getBars: async (
    symbolInfo: ChartSymbol,
    resolution: string | number,
    periodParams: Record<string, any>,
    onHistoryCallback: (bars: any[], options: {}) => void,
    onErrorCallback: (error: any) => void
  ) => {
    const { from, to, countBack, firstDataRequest } = periodParams;
    if (resolution.toString().includes('D')) resolution = 1440;
    if (resolution.toString().includes('W')) resolution = 10080;
    if(to < 1200000000) { // < 2008 year
      onHistoryCallback([], {noData: true});
      return;
    }
    console.log('[getBars]: Method call: ', resolution, humanDate(from), ' -> ', humanDate(to), countBack+' bars'); // symbolInfo
    try {
      const { success, result } = await fetchHistoryCandles({
        pair_id: symbolInfo.pair_id,
        to_ts: to, // 1467676800
        limit: 350,
        span: resolution as number,
      });

      if (!success || !('candles' in result) || !result.candles.length) {
        onHistoryCallback([], { noData: true }); // "noData" should be set if there is no data in the requested period.
        return;
      }
      result.candles.sort((a: any, b: any) => {
        if(a.time > b.time) return 1
        if(a.time < b.time) return -1
        return 0
      })
      const checkInvert = (number: number) => (symbolInfo.need_invert ? 1 / number : number)
      let bars: StreamingBar[] = [], lastBar: StreamingBar | null = null;
      result.candles.forEach(bar => {
        // if (bar.time >= from && bar.time < to) {
        // console.log('needInvert', symbolInfo.needInvert)
        bar = {
          time: bar.time * 1000,
          low: checkInvert(bar.low),
          high: checkInvert(bar.high),
          open: lastBar ? lastBar.close : checkInvert(bar.open),
          close: checkInvert(bar.close),
          volume: symbolInfo.need_invert ? bar.volume0 : bar.volume1
        }
        bars = [...bars, bar];
        lastBar = bar

        // } else { console.log('WHAT?', humanDate(bar.time), '>=', humanDate(from), ' ; ',  humanDate(bar.time), '<', humanDate(to)) }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false, });
    } catch (error) {
      console.log('[getBars]: Get error', error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo: ChartSymbol,
    resolution: string | number,
    onRealtimeCallback: () => {},
    subscribeUID: string,
    onResetCacheNeededCallback: () => void,
    lastBar: StreamingBar | null,
  ) => {
    console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name),
    );
  },

  unsubscribeBars: (subscriberUID: string) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    // chartStore().similarityPools = []
    unsubscribeFromStream(subscriberUID);
  },

  // Optional
  // getServerTime: cb => {},
  // calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {},
  // getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},
  // getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {}
};
