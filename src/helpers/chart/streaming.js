import { io } from 'socket.io-client'
import store from '@/store'
import { priceFormatter } from "@/helpers/common";

const channelToSubscription = new Map();

const socket = io('https://api.hazb.com', {
  path: '/ws/socket.io',
  transports: ['websocket', 'polling', 'flashsocket']
});

// const socket = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=30970dd127f1f2dffa78ac567b453d67295f174bce01035f3b2ab169276be70d');
// socket.onopen = function(event) { console.log('on open') };
// socket.onmessage = function(event) { console.log('on message', JSON.parse(event.data)) };
// socket.onclose = function(event) { console.log('on close', event.code) }; // code 1006 - error, 1005 - user close
// socket.onerror = function(event) { console.log('on error', event) };

socket.on('connect', () => {
  console.log('[socket] Connected');
});

socket.on('disconnect', (reason) => {
  console.log('[socket] Disconnected:', reason);
});

socket.on("connect_error", (error) => {
  console.error('[socket] Connect Error:', error);
});

socket.on('error', (error) => {
  console.log('[socket] Error:', error);
});

socket.on('m', data => {
  // console.log('[socket] Message:', data);
  if(data[0] === '0') { // candle
    candleMessageHandler(data)
  } else if(data[0] === '1') { // table
    tableMessageHandler(data)
  } else {
    return false
  }
})

const humanDate = (date, length = 16) => new Date(date).toISOString().slice(0, length).split('T').join(' ')
// const checkInvert = (number, needInvert) => (needInvert ? 1 / number : number)

function candleMessageHandler(data) {
  // 0~14~15~1651066924.0~19.643600704488794~0.05
  // свечи 0~{pair_id}~{span}~{ts}~{amount0}~{amount1}
  // цена = правое делить на левое
  // объём = цена * на левое
  let [
    , // 0
    pair_id, // 1234
    resolution, // 1D
    tradeTimeStr, // 1649773293
    amount0, // 20
    amount1, // 0.05
  ] = data.split('~');

  // if(store.getters['chart/needInvert']) {
  //   const oldAmount0 = amount0
  //   amount0 = amount1
  //   amount1 = oldAmount0
  // }

  const tradeTime = parseInt(tradeTimeStr) * 1000;
  const tradePrice = parseFloat(amount1 / amount0);
  const tradeVolume = parseFloat(amount0);

  const channelString = `0~${pair_id}~${resolution}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) { return }
  const lastBar = subscriptionItem.lastBar;
  // const resolution = subscriptionItem.resolution; // 1D, 60 & e.g.
  // const resolution = subscriptionItem.handlers[0].id.split('#_')[1]; // 1D, 60 & e.g.

  const nextBarTime = getNextBarTime(lastBar.time, resolution);

  // console.log(resolution, humanDate(lastBar.time), '<', humanDate(tradeTime, 19), '<', humanDate(nextBarTime), tradePrice)

  let bar;
  if (tradeTime >= nextBarTime) { // если пора рисовать новый бар
    bar = {
      time: nextBarTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
      volume: tradeVolume
    };
    console.log('[socket] Generate new bar', bar);
  } else {
    bar = {
      ...lastBar,
      // time: lastBar.time, open: lastBar.close, // TODO проверить, может вместо ...lastBar лучше open: lastBar.close & time: lastBar.time
      high: Math.max(lastBar.high, tradePrice),
      low: Math.min(lastBar.low, tradePrice),
      close: tradePrice,
      volume: lastBar.volume + tradeVolume
    };
    // console.log('[socket] Update the latest bar by price', tradePrice);
  }
  subscriptionItem.lastBar = bar;

  // store.dispatch('', )

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach(handler => handler.callback(bar));
}

function tableMessageHandler(data) {
  // 1~14~15~1651070483.0~89.10302463339211~0.22990089406023437~0xf7702834e5d3156e1857a3b958807e248a2f48c9~0x7a9d3e7fa21a3dd711434815602a767a6ffa6221292a80f80ad3a9042021d48a~sell
  // таблица 1~{pair_id}~{span}~{ts}~{amount0}~{amount1}~{maker}~{tx}~{direction}
  // цена = правое делить на левое
  // объём = цена * на левое
  let [
    , // 1 | 0
    , // pair_id
    , // resolution (1D)
    tradeTimeStr, // 1649773293
    amount0,
    amount1,
    maker, // 0x...
    tx, // 0x...
    type // buy | sell
  ] = data.split('~');

  // if(store.getters['chart/needInvert']) {
  //   const oldAmount0 = amount0
  //   amount0 = amount1
  //   amount1 = oldAmount0
  // }

  const tradePrice = parseFloat(amount1 / amount0);
  // const tradeVolume = parseInt(tradePrice * amount0);

  const item = {
    date: parseInt(tradeTimeStr),
    type: type,
    price: priceFormatter(tradePrice),
    amount_token0: priceFormatter(amount0),
    amount_token1: priceFormatter(amount1),
    maker: maker,
    tx: tx,
  }
  // console.log('table', data)
  store.dispatch('chart/pushLastTXs', item).then()

}

function getNextBarTime(lastBarTime, resolution) {
  const date = new Date(lastBarTime);
  resolution = resolution.includes('D') ? 1440 : (resolution.includes('W') ? 10080 : resolution)
  date.setTime(date.getTime() + resolution * 60 * 1000);
  return date.getTime();
  // var coeff = resolution * 60
  //  var rounded = Math.floor(data.ts / coeff) * coeff
  //  var lastBarSec = lastBar.time / 1000
  // if (rounded > lastBarSec) {
  // create a new candle, use last close as open **PERSONAL CHOICE**
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  lastBar,
) {
  const channelString = `0~${symbolInfo.pair_id}~${resolution}`; // ~${parsedSymbol.pairAddr}
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    console.log('subscribeOnStream', 'already subscribed to the channel, use the existing subscription. Handlers:', subscriptionItem.handlers) // subscribeUID
    return;
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    lastBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  console.log('[subscribeBars]: Subscribe to streaming. SubAdd Channel:', channelString);
  socket.emit('SubAdd', { subs: [channelString] });
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(handler => handler.id === subscriberUID);

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log('[unsubscribeBars]: Unsubscribe from streaming. SubRemove Channel:', channelString);
        socket.emit('SubRemove', { subs: [channelString] });
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
