import axios from "axios";
import store from "@/store";


let ws = null

function connectWs(pair, span, time) {
  store.commit('setConnected', 'loading')
  ws = new WebSocket(`wss://api.hazb.com/ws/candles/${pair}/${span}/${time}`);
}

export const startCandles = (pair, span, time, cbOnMessage) => {
  connectWs(pair, span, time)
  ws.onopen = function(event) {
    console.log('on open')
    store.commit('setConnected', true)
  };
  ws.onmessage = function(event) {
    console.log('on message', JSON.parse(event.data).length)
    // mainStoreActions.pushCandles(JSON.parse(event.data))
    cbOnMessage(JSON.parse(event.data))
  };
  ws.onclose = function(event) {
    console.log('on close', event.code) // code 1006 - error, 1005 - user close

    if(event.code === 1006) {
      store.commit('setConnected', false)
      // setTimeout(() => {
      //   connectWs(pair, span, time)
      // }, 1000)
    }
  };
  ws.onerror = function(event) {
    console.log('on error', event)
  };
}

export const closeWs = async () => {
  await ws.close()
}

export const fetchHistoryCandles = async (pair, span, dttm) => {
  const {data} = await axios.get(`xhr/candles/${pair}/${span}/${dttm}`, {
    // silenceAlert: true
  });
  return data
}

export const searchPair = async (search) => {
  const {data} = await axios.get(`xhr/search_pair/${search}`, {
  });
  return data
}

export async function makeApiRequest(path, body) {
  try {
    // const { data } = await axios.get(`https://min-api.cryptocompare.com/${path}`);
    const { data } = await axios.post(`https://api.ulud.net/xhr/${path}`,
      {...body},
      { headers: { Authorization: 'Basic ZGV2OmRldiFAIzE=' }}
    );
    return data
  } catch (error) {
    throw new Error(`API request error: ${error.status}`);
  }
}
