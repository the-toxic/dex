import { generateSymbol, parseFullSymbol } from './helpers.js';
import { makeApiRequest } from '@/api.js'
import { subscribeOnStream, unsubscribeFromStream } from './streaming.js';

const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ['1', '5', '10', '15', '30', '60', '180', '720', '1D', '1W'], // 1W
  exchanges: [{
    value: 'Bitfinex',
    name: 'Bitfinex',
    desc: 'Bitfinex exchange',
  },
    {
      // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
      value: 'Binance',
      // filter name
      name: 'Binance',
      // full exchange name displayed in the filter popup
      desc: 'Binance exchange',
    },
  ],
  symbols_types: [{
    name: 'crypto',
    // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
    value: 'crypto',
  }],
};

async function getAllSymbols() {
  const data = await makeApiRequest('data/v3/all/exchanges');
  let allSymbols = [];

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange.value].pairs;

    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map(rightPairPart => {
        const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
        return {
          symbol: symbol.short, // XMR/BTC - short symbol name
          full_name: symbol.full, // Kraken:XMR/BTC - full symbol name
          description: symbol.short, // XMR/BTC
          exchange: exchange.value, // Kraken - symbol exchange name
          type: 'crypto', // stock | "futures" | "crypto" | "forex" | "index" | any custom string
        };
      });
      allSymbols = [...allSymbols, ...symbols];
    }
  }
  return allSymbols;
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
    const symbols = await getAllSymbols(); // TODO add userInput in query
    const filteredSymbols = symbols.filter(symbol => {
      const isExchangeValid = exchange === '' || symbol.exchange === exchange;
      const isFullSymbolContainsInput = symbol.full_name
        .toLowerCase()
        .indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(filteredSymbols);
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName);
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(({full_name}) => full_name === symbolName);
    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
      onResolveErrorCallback('cannot resolve symbol');
      return;
    }
    const symbolInfo = {
      name: symbolItem.symbol,
      ticker: symbolItem.full_name,
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
    const { from, to, firstDataRequest } = periodParams;
    if(to < 1200000000) { // < 2008 year
      onHistoryCallback([], {noData: true});
      return;
    }
    console.log('[getBars]: Method call: ', resolution, new Date(from * 1000).toISOString().slice(0, 16), ' -> ', new Date(to * 1000).toISOString().slice(0, 16), symbolInfo);
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    const urlParameters = {
      e: parsedSymbol.exchange, // Bitfinex
      fsym: parsedSymbol.fromSymbol, // BTC
      tsym: parsedSymbol.toSymbol, // USD
      toTs: to, // 1467676800
      limit: 2000, // 2k candles
    };
    const query = Object.keys(urlParameters).map(name => `${name}=${encodeURIComponent(urlParameters[name])}`).join('&');
    try {
      const url = resolution === '1D' ? 'data/histoday' : resolution >= 60 ? 'data/histohour' : 'data/histominute';
      const data = await makeApiRequest(`${url}?${query}`);
      if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      let bars = [];
      data.Data.forEach(bar => {
        if (bar.time >= from && bar.time < to) {
          bars = [...bars, {
            time: bar.time * 1000,
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close,
          }];
        }
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
