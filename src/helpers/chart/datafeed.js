import { generateSymbol, parseFullSymbol } from './helpers.js';
import { makeApiRequest } from '@/api.js'
import { subscribeOnStream, unsubscribeFromStream } from './streaming.js';

const lastBarsCache = new Map();
let findedSymbols = [{
  symbol: 'TANK/BUSD', // XMR/BTC - short symbol name
  full_name: 'PanCake v2:TANK/BUSD:0x4e14498c6f679c6421db117bc9e9b08671d42996', // Kraken:XMR/BTC:pairAddr - full symbol name
  description: '0x4e14498c6f679c6421db117bc9e9b08671d42996', // pair addr
  exchange: '', // Binance - symbol exchange name
  type: 'Binance Smart Chain', // As example Network name, or stock | "futures" | "crypto" | "forex" | "index" | any custom string
}]

const configurationData = {
  supported_resolutions: ['1', '5', '10', '15', '30', '60', '180', '720', '1D', '1W'], // 1W
  exchanges: [
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
    name: 'Binance Smart Chain',
    value: 'Binance Smart Chain', // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
  },{
    name: 'Ethereum',
    value: 'eth',
  }],
};

async function getAllSymbols() {
  return [{
    symbol: 'TANK/BUSD', // XMR/BTC - short symbol name
    full_name: 'pancake:TANK/BUSD:0x4e14498c6f679c6421db117bc9e9b08671d42996', // Kraken:XMR/BTC:pairAddr - full symbol name
    description: '0x4e14498c6f679c6421db117bc9e9b08671d42996', // pair addr
    exchange: 'pancake', // Binance - symbol exchange name
    type: 'bsc', // As example Network name, or stock | "futures" | "crypto" | "forex" | "index" | any custom string
  }];

  // const data = await makeApiRequest('data/v3/all/exchanges');
  // let allSymbols = [];
  //
  // for (const exchange of configurationData.exchanges) {
  //   const pairs = data.Data[exchange.value].pairs;
  //
  //   for (const leftPairPart of Object.keys(pairs)) {
  //     const symbols = pairs[leftPairPart].map(rightPairPart => {
  //       const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
  //       return {
  //         symbol: symbol.short, // XMR/BTC - short symbol name
  //         full_name: symbol.full, // Kraken:XMR/BTC - full symbol name
  //         description: symbol.short, // XMR/BTC
  //         exchange: exchange.value, // Kraken - symbol exchange name
  //         type: 'crypto', // stock | "futures" | "crypto" | "forex" | "index" | any custom string
  //       };
  //     });
  //     allSymbols = [...allSymbols, ...symbols];
  //   }
  // }
  // return allSymbols;
}

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
    findedSymbols = [...result.content]

    onResultReadyCallback(result.content);


    // const symbols = await getAllSymbols(); // TODO add userInput in query
    // const filteredSymbols = symbols.filter(symbol => {
    //   const isExchangeValid = exchange === '' || symbol.exchange === exchange;
    //   const isFullSymbolContainsInput = symbol.full_name
    //     .toLowerCase()
    //     .indexOf(userInput.toLowerCase()) !== -1;
    //   return isExchangeValid && isFullSymbolContainsInput;
    // });
    // onResultReadyCallback(filteredSymbols);
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName);
    // const symbols = await getAllSymbols();
    const symbolItem = findedSymbols.find(({full_name}) => full_name === symbolName);
    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
      onResolveErrorCallback('cannot resolve symbol');
      return;
    }
    const symbolInfo = {
      name: symbolItem.symbol,
      ticker: symbolItem.full_name,
      full_name: symbolItem.full_name, // self adding for show pair address in getBars
      description: symbolItem.description,
      type: symbolItem.type,
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: symbolItem.exchange,
      minmov: 1, // формат цены
      pricescale: 100, // формат цены. 100 - 2 символа после запятой, 1000 - 3 символа
      has_intraday: true, // включение минутных свечей, но надо сконфигурировать
      intraday_multipliers: ['1', '5', '30', '60', '180', '720'], // указанные интервалы будут генерить запросы в БД, все остальные будут автоматом генериться либой на основе более, например 5-минутка будет складываться из 5 минутных баров
      has_weekly_and_monthly: false, // если false то либа сама построит соответствующие разрешения по дневным барам, иначе будет генерить запросы
      // weekly_multipliers: ['1'], // если либа генерит сама, и в разрешениях есть 2 недели, она будет сама складывать 2 бара по 1 неделе
      // monthly_multipliers: ['1'],
      has_empty_bars: true,
      supported_resolutions: configurationData.supported_resolutions,
      visible_plots_set: 'ohlc', // Support: open, high, low, close. With 'value': "ohlcv"
      // volume_precision: 2, // кол-во десятичных символов в объеме
      data_status: 'streaming', // streaming | endofday | pulsed | delayed_streaming
    };
    // if (split_data[2].match(/USD|USDT|BUSD/)) { symbolInfo.pricescale = 100 }

    console.log('[resolveSymbol]: Symbol resolved', symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { from, to, countBack, firstDataRequest } = periodParams;
    if (resolution.toString().includes('D')) resolution = 1440;
    if (resolution.toString().includes('W')) resolution = 10080;
    if(to < 1200000000) { // < 2008 year
      onHistoryCallback([], {noData: true});
      return;
    }
    console.log('[getBars]: Method call: ', resolution, new Date(from * 1000).toISOString().slice(0, 16), ' -> ', new Date(to * 1000).toISOString().slice(0, 16), countBack+' bars'); // symbolInfo
    // console.log('symbolInfo', symbolInfo)
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    // console.log('parsedSymbol', parsedSymbol)
    const body = {
      e: parsedSymbol.exchange, // Bitfinex, pancake
      fsym: parsedSymbol.fromSymbol, // BTC, TANK
      tsym: parsedSymbol.toSymbol, // USD, BUSD
      fromTs: from, // 1467676800
      toTs: to, // 1467676800
      span: resolution,
      paddr: parsedSymbol.pairAddr
    };
    // const query = Object.keys(urlParameters).map(name => `${name}=${encodeURIComponent(urlParameters[name])}`).join('&');
    // const url = resolution === '1D' ? 'data/histoday' : resolution >= 60 ? 'data/histohour' : 'data/histominute';
    try {
      const { success, result } = await makeApiRequest(`candles_history`, body);

      if (!success || !'candles' in result || !result.candles.length) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], { noData: true });
        return;
      }
      result.candles.sort((a,b) => {
        if(a.time > b.time) return 1
        if(a.time < b.time) return -1
        return 0
      })
      let bars = [], lastBar = null;
      result.candles.forEach(bar => {
        // if (bar.time >= from && bar.time < to) {
          bars = [...bars, {
            time: bar.time * 1000,
            low: bar.low,
            high: bar.high,
            open: lastBar ? lastBar.close : bar.open,
            close: bar.close,
          }];
          lastBar = bar

        // } else { console.log('WHAT?', humanDate(bar.time), '>=', humanDate(from), ' ; ',  humanDate(bar.time), '<', humanDate(to)) }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, {
        noData: false,
      });
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

function humanDate(date) {
  return new Date(date * 1000).toISOString().slice(0, 16)
}