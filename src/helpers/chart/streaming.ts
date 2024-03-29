import { io } from 'socket.io-client'
import { useMainStore } from "@/store/mainStore";
import { useChartStore } from "@/store/chartStore";
import { Address, ChartSymbol, LastTxsItem, StreamingBar, StreamingSubHandler } from "@/types";

const mainStore = () => useMainStore()
const chartStore = () => useChartStore()

const channelToSubscription = new Map();

let apiDomain = import.meta.env.VITE_APP_API_DOMAIN
if(window.location.host.includes('.app') || window.location.host.includes('localhost')) { // if dev
  apiDomain =  import.meta.env.VITE_APP_API_DOMAIN_DEV
}


const socket = io(apiDomain, {
  path: '/ws/socket.io',
  transports: ['websocket', 'polling', 'flashsocket'],
  // reconnection: false,
  reconnectionAttempts: 5, // reconnect limiter
  query: {
    "session_id": chartStore().sessionId
  }
});

// const socket = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=30970dd127f1f2dffa78ac567b453d67295f174bce01035f3b2ab169276be70d');
// socket.onopen = function(event) { console.log('on open') };
// socket.onmessage = function(event) { console.log('on message', JSON.parse(event.data)) };
// socket.onclose = function(event) { console.log('on close', event.code) }; // code 1006 - error, 1005 - user close
// socket.onerror = function(event) { console.log('on error', event) };

socket.on('connect', () => {
  console.log('[socket] Connected. ID:', socket.id);
  mainStore().setConnected(true)
});

socket.on('disconnect', (reason) => {
  console.log('[socket] Disconnected:', reason);
  mainStore().setConnected(false)
});

socket.on("connect_error", (error) => {
  console.log('[socket] Connect Error:', error.message);
});

socket.on('error', (error) => {
  console.log('[socket] Error:', error);
});
socket.io.on("reconnect", (attempt) => {
  mainStore().setConnected('loading')
  console.log('[socket] Reconnect: ', attempt);
});
socket.io.on("reconnect_attempt", (attempt) => {
  console.log('[socket] Reconnect attempt:', attempt);
});
socket.io.on("reconnect_error", (error) => {
  console.log('[socket] Reconnect error:', error);
});
socket.io.on("reconnect_failed", () => {
  console.log('[socket] Reconnect failed');
});
// socket.io.on("ping", () => {
//   console.log('[socket] Ping:', arguments);
// });
socket.onAny((event, ...args) => {
  if(event !== 'm') {
    console.log(`got onAny: ${event}`, args);
  }
});
// setTimeout(() => {
//   console.log(socket.listenersAny())
// }, 5000)

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

// const humanDate = (date: string, length = 16) => new Date(date).toISOString().slice(0, length).split('T').join(' ')
// const checkInvert = (number, needInvert) => (needInvert ? number : 1 / number)

function candleMessageHandler(data: string) {
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

  const chartSymbol = chartStore().activeSymbol as ChartSymbol
  if(!chartSymbol || +chartSymbol?.pair_id !== +pair_id) {
    return; // fix bug delay call SubRemove
  }

  if(chartStore().needInvert) {
    const oldAmount0 = amount0
    amount0 = amount1
    amount1 = oldAmount0
  }

  const tradeTime = parseInt(tradeTimeStr) * 1000;
  const tradePrice = parseFloat(String(+amount1 / +amount0));
  const tradeVolume = parseFloat(amount0);

  const channelString = `0~${pair_id}~${resolution}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined || subscriptionItem.lastBar === undefined) { return } // lastBar undefined when /limit_candles_history = [empty]
  const lastBar = subscriptionItem.lastBar;
  // const resolution = subscriptionItem.resolution; // 1D, 60 & e.g.
  // const resolution = subscriptionItem.handlers[0].id.split('#_')[1]; // 1D, 60 & e.g.

  const nextBarTime = getNextBarTime(lastBar.time, resolution);

  // console.log(resolution, humanDate(lastBar.time), '<', humanDate(tradeTime, 19), '<', humanDate(nextBarTime), tradePrice)



  let bar: StreamingBar;
  if (tradeTime >= nextBarTime) { // если пора рисовать новый бар
    bar = {
      time: nextBarTime,
      open: lastBar.close,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
      volume: tradeVolume
    };
    console.log('[socket] Generate new bar'/*, bar*/);
  } else {
    bar = {
      ...lastBar,
      // time: lastBar.time, open: lastBar.close,
      high: Math.max(lastBar.high, tradePrice),
      low: Math.min(lastBar.low, tradePrice),
      close: tradePrice,
      volume: lastBar.volume + tradeVolume
    };
    // console.log('[socket] Update the latest bar by price', tradePrice);
  }
  subscriptionItem.lastBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler: StreamingSubHandler) => handler.callback(bar));
}

function tableMessageHandler(data: any) {
  // 1~10~15~1651639383.0~867.1865216318507~2.2613733312250917~0x2eae1660df22b0bbd80170092c23ff965e72a79c~0x2eae1660df22b0bbd80170092c23ff965e72a79c~0xe6a49844d7e3bfb4cf4cb7a25d531a8256e0b9c480dbd89a78c3c60fded5b118~buy~123
  // таблица 1~{pair_id}~{span}~{ts}~{amount0}~{amount1}~{maker}~{receiver}~{tx}~{direction}~{router_id}
  // цена = правое делить на левое
  // объём = цена * на левое
  let [
    , // 1 | 0
    pair_id, // pair_id
    , // resolution (1D)
    tradeTimeStr, // 1649773293
    amount0,
    amount1,
    maker, // JSON
    receiver, // JSON
    tx, // 0x...
    type, // buy | sell
    routerId, // 123
  ] = data.split('~');

  maker = JSON.parse(maker)
  const parsedMaker: Address = {
    address: maker.a,
    entity: {
      uuid: maker.e.u,
      name: maker.e.n,
    },
    global_label: {
      id: maker.gl.i,
      label: maker.gl.l,
    },
    local_label: {
      id: maker.ll.i,
      label: maker.ll.l,
    },
  }

  receiver = JSON.parse(receiver)
  const parsedReceiver: Address = {
    address: receiver.a,
    entity: {
      uuid: receiver.e.u,
      name: receiver.e.n,
    },
    global_label: {
      id: receiver.gl.i,
      label: receiver.gl.l,
    },
    local_label: {
      id: receiver.ll.i,
      label: receiver.ll.l,
    },
  }

  const chartSymbol = chartStore().activeSymbol as ChartSymbol
  if(!chartSymbol || +chartSymbol?.pair_id !== +pair_id) {
    return; // fix bug delay call SubRemove
  }

  if(chartStore().needInvert) {
    const oldAmount0 = amount0
    amount0 = amount1
    amount1 = oldAmount0
  }

  const item: LastTxsItem = {
    date: parseInt(tradeTimeStr),
    type,
    // price: parseFloat(amount1 / amount0),
    amount_token0: parseFloat(amount0),
    amount_token1: parseFloat(amount1),
    maker: parsedMaker,
    receiver: parsedReceiver,
    tx,
    router_id: parseInt(routerId)
  }
  // console.log('table', data)
  chartStore().addNewTx(item).then()

}

function getNextBarTime(lastBarTime: string, resolution: string) {
  const date = new Date(lastBarTime);
  const resolutionNumber = resolution.includes('D') ? 1440 : (resolution.includes('W') ? 10080 : +resolution)
  date.setTime(date.getTime() + resolutionNumber * 60 * 1000);
  return date.getTime();
  // var coeff = resolution * 60
  //  var rounded = Math.floor(data.ts / coeff) * coeff
  //  var lastBarSec = lastBar.time / 1000
  // if (rounded > lastBarSec) {
  // create a new candle, use last close as open **PERSONAL CHOICE**
}

export function subscribeOnStream(
  symbolInfo: ChartSymbol,
  resolution: string | number,
  onRealtimeCallback: () => {},
  subscribeUID: string,
  onResetCacheNeededCallback: () => void,
  lastBar: StreamingBar | null,
) {
  const channelString = `0~${symbolInfo.pair_id}~${resolution}`; // ~${parsedSymbol.pairAddr}
  const handler: StreamingSubHandler = {
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
  socket.emit('SubAdd', { subs: [channelString], session_id: chartStore().sessionId });

  // onResetCacheNeededCallback(() => {
  //   console.log('123')
  // })
}

export function unsubscribeFromStream(subscriberUID: string) {
  // find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex((handler: StreamingSubHandler) => handler.id === subscriberUID);

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        console.log('[unsubscribeBars]: Unsubscribe from streaming. SubRemove Channel:', channelString);
        socket.emit('SubRemove', { subs: [channelString], session_id: chartStore().sessionId });
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
