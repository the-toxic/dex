import axios from "axios";
import { mapActions, mapStores, mapWritableState } from "pinia";
import { useMainStore } from './stores/main';
const mainStoreActions = mapActions(useMainStore, ['pushCandles', 'setConnected']) //todo разобарться


let ws = null

const fetchHistoryCandles = async (pair, span, dttm) => {
  const {data} = await axios.get(`xhr/candles/${pair}/${span}/${dttm}`, {
    // silenceAlert: true
  });
  return data
}

const startCandles = (pair, span, time, callback) => {
  ws = new WebSocket(`wss://api.hazb.com/ws/candles/${pair}/${span}/${time}`);
  ws.onopen = function(event) {
    console.log('on open')
    mainStoreActions.setConnected(true)
  };
  ws.onmessage = function(event) {
    console.log('on message', JSON.parse(event.data).length)
    // mainStoreActions.pushCandles(JSON.parse(event.data))
    callback(JSON.parse(event.data))
  };
  ws.onclose = function(event) {
    console.log('on close', event) // code 1006
    mainStoreActions.setConnected(false)
  };
  ws.onerror = function(event) {
    console.log('on error', event)
  };
}

const closeWs = () => {
  ws.close()
}

export { startCandles, closeWs, fetchHistoryCandles }