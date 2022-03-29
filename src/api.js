import axios from "axios";
import { mapActions, mapStores, mapWritableState } from "pinia";
import { useMainStore } from './stores/main';
const mainStoreActions = mapActions(useMainStore, ['pushCandles', 'setConnected'])


let ws = null

const fetchHistoryCandles = async (pair, span, dttm) => {
  const {data} = await axios.get(`xhr/candles/${pair}/${span}/${dttm}`, {
    // silenceAlert: true
  });
  return data
}

function connectWs(pair, span, time) {
  mainStoreActions.setConnected('loading')
  ws = new WebSocket(`wss://api.hazb.com/ws/candles/${pair}/${span}/${time}`);
}

const startCandles = (pair, span, time, cbOnMessage) => {
  connectWs(pair, span, time)
  ws.onopen = function(event) {
    console.log('on open')
    mainStoreActions.setConnected(true)
  };
  ws.onmessage = function(event) {
    console.log('on message', JSON.parse(event.data).length)
    // mainStoreActions.pushCandles(JSON.parse(event.data))
    cbOnMessage(JSON.parse(event.data))
  };
  ws.onclose = function(event) {
    console.log('on close', event.code) // code 1006 - error, 1005 - user close

    if(event.code === 1006) {
      mainStoreActions.setConnected(false)
      setTimeout(() => {
        connectWs(pair, span, time)
      }, 1000)
    }
  };
  ws.onerror = function(event) {
    console.log('on error', event)
  };
}

const closeWs = async () => {
  console.log('closeWs')
  await ws.close()
}

export { startCandles, closeWs, fetchHistoryCandles }