import { makeApiRequest } from '@/api.js'
import { subscribeOnStream, unsubscribeFromStream } from './streaming.js';
import store from "@/store";

const lastBarsCache = new Map();

let findedSymbols = [
//   {
//   symbol: 'USDT/WBNB', // XMR/BTC - short symbol name
//   pair_id: 38,
//   full_name: 'PanCake v2:USDT/WBNB:0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', // Kraken:XMR/BTC:pairAddr - full symbol name
//   exchange: 'PanCake v2', // Binance - symbol exchange name
//   type: 'BSC', // Network name | stock | "futures" | "crypto" | "forex" | "index" | any custom string
//   description: 'Pair: 0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', // require for initial load page, or library show full_name
// },
//   {
//   symbol: 'TANK/BUSD', // XMR/BTC - short symbol name
//   pair_id: 5787,
//   full_name: 'PanCake v2:TANK/BUSD:0x4e14498c6f679c6421db117bc9e9b08671d42996', // Kraken:XMR/BTC:pairAddr - full symbol name
//   exchange: 'PanCake v2', // Binance - symbol exchange name
//   type: 'Binance Smart Chain', // As example Network name, or stock | "futures" | "crypto" | "forex" | "index" | any custom string
//   description: '',
// }
]

async function loadDefaultPair(symbolFullName) {
  const pairAddress = symbolFullName.split(':')[2]
  const {success, result} = await makeApiRequest(`search_pair`, { search: pairAddress, exchange: '', network: '' })
  if(success && result?.content && result.content.length) {
    const pair = result.content[0]
    pair.description = `Pair: ${pair.pair_addr}`
    findedSymbols = [pair]
  }
}

const configurationData = {
  supported_resolutions: ['1', '5', '10', '15', '30', '60', '180', '720', '1D', '1W'], // 1W
  exchanges: [
    { value: '', name: 'All', desc: 'All DEX' },
    { value: 'PanCake v2', name: 'PanCake v2', desc: 'Pancake DEX' },
    { value: 'Uniswap V2 Router 01', name: 'Uniswap V2 Router 01', desc: 'Uniswap DEX' },
    { value: 'Uniswap V2 Router 02', name: 'Uniswap V2 Router 02', desc: 'Uniswap DEX' },
    { value: 'Uniswap V3 Router 01', name: 'Uniswap V3 Router 01', desc: 'Uniswap DEX' },
    { value: 'Uniswap V3 Router 02', name: 'Uniswap V3 Router 02', desc: 'Uniswap DEX' },
    { value: 'SushiSwap', name: 'SushiSwap', desc: 'SushiSwap DEX' },
    { value: 'ShibaSwap', name: 'ShibaSwap', desc: 'ShibaSwap DEX' },
    { value: 'KyberSwap', name: 'KyberSwap', desc: 'KyberSwap DEX' },
    { value: 'MintySwap', name: 'MintySwap', desc: 'MintySwap DEX' },
    { value: 'SafeMoon Swap', name: 'SafeMoon Swap', desc: 'SafeMoon Swap DEX' },
    { value: 'Swapr', name: 'Swapr', desc: 'Swapr DEX' },
  ],
  symbols_types: [{
      name: 'All Networks',
      value: '', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
    }, {
      name: 'Binance Smart Chain',
      value: 'BSC', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
    }, {
      name: 'Ethereum',
      value: 'Ethereum',
  }],
};

const toNumber = (value, isRound = false) => isNaN(value) ? 0 : new Intl.NumberFormat('en-US').format(isRound ? Math.round(value) : value)
const shortAddress = (wallet) => wallet.slice(0,12) + '...' + wallet.slice(-12)
const humanDate = (date) => new Date(date * 1000).toISOString().slice(0, 16)

export default {
  onReady: (callback) => {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput, // search text
    exchange, // Bitfinex
    symbolType, // 'ctypto'
    onResultReadyCallback,
  ) => {
    console.log('[searchSymbols]: Method call', userInput, exchange, symbolType);
    const {success, result} = await makeApiRequest(`search_pair`, {
      search: userInput,
      exchange: exchange,
      network: symbolType
    });
    if(!success || !'content' in result) {
      onResultReadyCallback([]);
      return
    }
    result.content.forEach(i => {
      i.description = `Pair: ${shortAddress(i.pair_addr)} | TX: ${toNumber(i.tx_count)} | ID: ${i.pair_id}`
      i.exchange = i.exchange === 'UNKNOWN_ROUTER' ? 'UNKNOWN' : i.exchange
    })
    result.content.sort((a,b) => { // filter by TX count, DESC
      if(a.tx_count > b.tx_count) return -1
      if(a.tx_count < b.tx_count) return 1
      return 0
    })
    findedSymbols = [...result.content]

    onResultReadyCallback(result.content);
  },

  resolveSymbol: async (
    symbolFullName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    console.log('[resolveSymbol]: Method call', symbolFullName);
    if(!findedSymbols.length) await loadDefaultPair(symbolFullName) // on load page get default pair

    const symbolItem = findedSymbols.find(({full_name}) => full_name === symbolFullName);

    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolFullName);
      onResolveErrorCallback('cannot resolve symbol');
      return;
    }
    const symbolInfo = {
      name: symbolItem.symbol,
      ticker: symbolItem.full_name,
      full_name: symbolItem.full_name, // self adding for show pair address in getBars
      description: symbolItem.description, // выводится рядом с зеленой иконкой коннекта
      type: symbolItem.type,
      pair_id: symbolItem.pair_id,
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: symbolItem.exchange,
      exchange_id: symbolItem.exchange_id,
      minmov: 1, // формат цены
      pricescale: 100000, // формат цены. 100 - 2 символа после запятой, 1000 - 3 символа
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
      // needInvert: false
    };
    // symbolInfo.checkInvert = function () {
    //   const detectStablecoin = this.name.match(/BUSD|TUSD|USDT|USDC|DAI|USD|UST/)
    //   return detectStablecoin && detectStablecoin.index === 0
    // }
    // symbolInfo.needInvert = symbolItem.needInvert = symbolInfo.checkInvert() // on first load symbol

    console.log('[resolveSymbol]: Symbol resolved', symbolFullName);

    store.dispatch('chart/setSymbol', symbolItem).then()

    setTimeout(() => onSymbolResolvedCallback(symbolInfo))
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { from, to, countBack, firstDataRequest } = periodParams;
    if (resolution.toString().includes('D')) resolution = 1440;
    if (resolution.toString().includes('W')) resolution = 10080;
    if(to < 1200000000) { // < 2008 year
      onHistoryCallback([], {noData: true});
      return;
    }
    console.log('[getBars]: Method call: ', resolution, humanDate(from), ' -> ', humanDate(to), countBack+' bars'); // symbolInfo
    const body = {
      pair_id: symbolInfo.pair_id,
      to_ts: to, // 1467676800
      limit: 1000,
      span: resolution,
    };
    try {
      const { success, result } = await makeApiRequest(`limit_candles_history`, body);

      if (!success || !'candles' in result || !result.candles.length) {
        onHistoryCallback([], { noData: true }); // "noData" should be set if there is no data in the requested period.
        return;
      }
      result.candles.sort((a,b) => {
        if(a.time > b.time) return 1
        if(a.time < b.time) return -1
        return 0
      })
      // const checkInvert = (number) => (symbolInfo.needInvert ? number : 1 / number)
      let bars = [], lastBar = null;
      result.candles.forEach(bar => {
        // if (bar.time >= from && bar.time < to) {
        // console.log('needInvert', symbolInfo.needInvert)
        bar = {
          time: bar.time * 1000,
          low: bar.low,
          high: bar.high,
          open: lastBar ? lastBar.close : bar.open,
          close: bar.close,
          volume: bar.volume
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
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
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

  unsubscribeBars: (subscriberUID) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    unsubscribeFromStream(subscriberUID);
  },

  // Optional
  // getServerTime: cb => {},
  // calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {},
  // getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},
  // getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {}
};
