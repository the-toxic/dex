import { io } from 'socket.io-client'
import { parseFullSymbol } from './helpers.js';

const channelToSubscription = new Map();

const socket = io('https://api.hazb.com', {
  path: '/ws/socket.io',
  transports: ['websocket', 'polling', 'flashsocket']
});
// const socket = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=30970dd127f1f2dffa78ac567b453d67295f174bce01035f3b2ab169276be70d');
window.socket = socket

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
    return
  } else {
    return false
  }
})

function candleMessageHandler(data) {
  const [
    // 0~4321~TANK~BUSD~ts~price~volume"
    eventTypeStr, // 0
    pair_id, // 1234
    // fromSymbol, // BTC
    // toSymbol, // USD
    tradeTimeStr, // 1649773293
    tradePriceStr, // 40143
    tradeVolumeStr, // 100
  ] = data.split('~');

  const tradePrice = parseFloat(tradePriceStr);
  const tradeTime = parseInt(tradeTimeStr) * 1000;
  const tradeVolume = parseInt(tradeVolumeStr);
  // const channelString = `0~${pair_id}~${fromSymbol}~${toSymbol}`;
  const channelString = `0~${pair_id}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  // console.log('channelToSubscription', channelString, channelToSubscription)
  // console.log(pair_id, fromSymbol, toSymbol, tradeTimeStr, tradePriceStr, tradeVolumeStr)

  if (subscriptionItem === undefined) { return }
  const lastBar = subscriptionItem.lastBar;
  // const resolution = subscriptionItem.resolution; // 1D, 60 & e.g.
  const resolution = subscriptionItem.handlers[0].id.split('#_')[1]; // 1D, 60 & e.g.

  const nextBarTime = getNextBarTime(lastBar.time, resolution);

  console.log(resolution, new Date(lastBar.time).toISOString(), new Date(tradeTime).toISOString(), new Date(nextBarTime).toISOString())

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
      ...lastBar, // TODO проверить, может лучше open: lastBar.close & time: lastBar.time
      high: Math.max(lastBar.high, tradePrice),
      low: Math.min(lastBar.low, tradePrice),
      close: tradePrice,
      volume: tradeVolume
    };
    console.log('[socket] Update the latest bar by price', tradePrice);
  }
  subscriptionItem.lastBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach(handler => handler.callback(bar));
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
  // const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  // const channelString = `0~${symbolInfo.pair_id}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`; // ~${parsedSymbol.pairAddr}
  const channelString = `0~${symbolInfo.pair_id}`; // ~${parsedSymbol.pairAddr}
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
