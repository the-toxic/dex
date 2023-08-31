import axios from "axios";
import { setCookie } from '@/helpers/common'
import { useChartStore } from "@/store/chartStore";

const chartStore = () => useChartStore()


// let ws = null
//
// function connectWs(pair, span, time) {
//   store.commit('setConnected', 'loading')
//   ws = new WebSocket(`wss://api.hazb.com/ws/candles/${pair}/${span}/${time}`);
// }
//
// export const startCandles = (pair, span, time, cbOnMessage) => {
//   connectWs(pair, span, time)
//   ws.onopen = function(event) {
//     console.log('on open')
//     store.commit('setConnected', true)
//   };
//   ws.onmessage = function(event) {
//     console.log('on message', JSON.parse(event.data).length)
//     // mainStoreActions.pushCandles(JSON.parse(event.data))
//     cbOnMessage(JSON.parse(event.data))
//   };
//   ws.onclose = function(event) {
//     console.log('on close', event.code) // code 1006 - error, 1005 - user close
//
//     if(event.code === 1006) {
//       store.commit('setConnected', false)
//       // setTimeout(() => {
//       //   connectWs(pair, span, time)
//       // }, 1000)
//     }
//   };
//   ws.onerror = function(event) {
//     console.log('on error', event)
//   };
// }

// export const closeWs = async () => {
//   await ws.close()
// }
// export const searchPair = async (search) => {
//   const {data} = await axios.get(`xhr/search_pair/${search}`, {});
//   return data
// }
//
// export const fetchHistoryCandles = async (pair, span, dttm) => {
//   const {data} = await axios.get(`xhr/candles/${pair}/${span}/${dttm}`, {
//     // silenceAlert: true
//   });
//   return data
// }

const delay = async (ms) => await new Promise(resolve => setTimeout(() => {
  resolve(true)
}, ms))

/** Auth module */

export async function signIn(payload) {
  return await axios.post(`auth/sign-in`, payload);
}

export async function signUp(payload) {
  return await axios.post(`auth/sign-up`, payload);
}

export async function resetPassword(payload) {
  return await axios.post(`auth/reset-password`, payload);
}

export async function otp(payload) {
  return await axios.post(`auth/otp`, payload);
}

export async function otpResend(payload) {
  return await axios.post(`auth/otp-resend`, payload);
}

export async function setPassword(payload) {
  return await axios.post(`auth/set-password`, payload);
}

export async function inviteRequest(payload) {
  return await axios.post(`auth/invite`, payload);
}

export async function refreshJwt({ token }) {
  return await axios.post(`user/refresh`, { token });
}


/** User module */
export async function updateProfile(payload) {
  return await axios.post(`user/profile`, payload);
}

export async function changePassword(payload) {
  return await axios.post(`user/password`, payload);
}

export async function deleteAccount() {
  return await axios.post(`user/delete`);
}

/** Explorer page */
export const fetchPairs = async (payload) => {
  payload.sortDir = payload.sortBy.order
  payload.sortBy = payload.sortBy.key
  return await axios.post(`xhr/pair_explorer`, payload);
}
export const fetchBigSwaps = async (payload) => {
  await delay(500)
  return {
    success: true, result: [
      {pair_id: '1', date: '2023-08-25 12:13:14', type: 'sell', pair_name: 'WBNB/USDT', quantity: 333.45, variation: 4.33, total: 333.45, total_usd: 72111.55,
        token0: {symbol: 'WBNB', name: 'Wrapped BNB', icon: 'https://api.hazb.app/images/tokens/smartchain/0xbb4C/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png'}, token1: {symbol: 'USDT', name: 'Tether USD', icon: 'https://api.hazb.app/images/tokens/smartchain/0x55d3/0x55d398326f99059fF775485246999027B3197955.png'},
        maker_addr: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
        tx_addr: '0xd2486b717dd2426729f48302b9b6a2e1b67a70ab8796568a36745f62f4ad3bff',
        pair_addr: '0xd2486b717dd2426729f48302b9b6a2e1b67a70ab8796568a36745f62f4ad3bff',
      }
    ]
  }
}
export const fetchSC = async (payload) => {
  // payload.sortDir = payload.sortBy.order
  // payload.sortBy = payload.sortBy.key
  // return await axios.post(`xhr/sc`, payload);
  await delay(500)
  return { data: {
    success: true, result: {
      items: [
        { wallet: '0x12312321312323', tx_id: '0xF235647334734', bought: 4123.12345, sold: 1234.11111, different: 2987.111111, cost: 4222.12345, revenue: 6211.235235, profit: 2000.12345, roi: 40.12 },
        { wallet: '0x12312321312323', tx_id: '0xF235647334734', bought: 4123.12345, sold: 1234.11111, different: 2987.111111, cost: 4222.12345, revenue: 6211.235235, profit: 2000.12345, roi: 40.12 },
      ],
      totalItems: 2,
      total: { bought: 8223.12345, sold: 2460.11111, different: 5987.111111, cost: 4222.12345, revenue: 6211.235235, profit: 4000.12345, roi: 40.12 }
  }}}
}

/** Whitelist page */
export const fetchWhitelistWallets = async (payload) => {
  await delay(500)
  return {
    data: {success: true, result: [
      {id: 1, label: 'Cool wallet 1', network: 'bsc', note: 'Balance 1kkk USD', address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5641'},
      {id: 2, label: 'Cool wallet 2', network: 'bsc', note: 'Balance 1kkk USD', address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5642'},
      {id: 3, label: 'Cool wallet 3', network: 'bsc', note: 'Balance 1kkk USD', address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5643'},
    ]}
  }
  // return  await axios.post(`user/watchlist_wallets`, payload)
}
export const fetchWhitelistWalletItem = async (id) => {
  await delay(500)
  return {
    data: {success: true, result: {id: 1, label: 'Cool wallet 1', network: 'bsc', note: 'Balance 1kkk USD', address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5641'}}
  }
  // return  await axios.get(`user/get_watchlist_wallet`, {id})
}
export const saveWatchlistWallet = async (payload) => {
  await delay(500)
  return { data: {success: true, result: { ...payload }} }
  // return  await axios.post(`user/save_watchlist_wallet`, payload)
}
export const deleteWatchlistItem = async (payload) => {
  await delay(500)
  return { data: {success: true, result: { ...payload }} }
  // return  await axios.post(`user/delete_watchlist_item`, payload)
}
export const fetchWhitelistTokens = async (payload) => {
  await delay(500)
  return {
    data: {success: true, result: [
      {id: 1, network: 'bsc', name: 'TANK', price: 0.0021, percent_5_holders: 23.44, change_7d: 4112445.11,  change_30d: -2144771.22, market_cap: 23040111.22, address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'}
    ]}
  }
  // return  await axios.post(`user/watchlist_tokens`, payload)
}

/** Pair page */
export const searchPair = async (payload) => {
  const { data } = await axios.post(`xhr/search_pair`, payload, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}
export const fetchPairInfo = async (pairId) => {
  const { data } = await axios.get(`xhr/pair_info?pair_id=${pairId}`, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}
export const fetchHistoryTable = async (payload) => {
  const chainId = payload.chain_id
  const pairId = payload.pair_id
  const lastBlockId = payload.block_id || 0
  const { data } = await axios.get(`xhr/txs?chain_id=${chainId}&pair_id=${pairId}&block_id=${lastBlockId}`, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}
export const fetchHistoryCandles = async (body) => {
  const { data } = await axios.post(`xhr/limit_candles_history`, body, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}

export const fetchExchanges = async () => {
  const { data } = await axios.get(`xhr/routers`);
  return data
}

