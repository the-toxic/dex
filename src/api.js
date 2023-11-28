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

const delay = async (ms) => await new Promise(resolve => setTimeout(() => resolve(true), ms))

/** Auth module */

export async function signIn(payload) {
  // await delay(500)
  // return { data: { success: true, result: { user: {"id":31,"unique_id":"SJEQIQ","email":"admin@hazb.com","first_name":"Admin","last_name":"Admin","tz":"Africa/Juba","status":1,"created_at":"2023-08-18 07:45:02","wallet":"","discord":"","telegram":"","ref_id":0}, access_token:"", refresh_token:""} }}
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
export const fetchChains = async () => {
  // return { data: { success: true, result: { 1: { name: 'Ethereum', native_symbol: 'ETH', native_symbol_price: 1, icon_folder: '' }, 2: { name: 'BSC', native_symbol: 'BSC', native_symbol_price: 1, icon_folder: '' }, } } }
  return await axios.get(`xhr/chains`);
}

export const fetchPairs = async (payload) => {
  payload.sortDir = payload.sortBy.order
  payload.sortBy = payload.sortBy.key
  return await axios.post(`xhr/pair_explorer`, payload);
}
export const fetchBigSwaps = async (payload) => {
  await delay(500)
  return {
    success: true, result: [
      {pair_id: '1', date: '2023-08-25 12:13:14', chain_id: 2, type: 'sell', pair_name: 'WBNB/BUSD', quantity: 333.45, variation: 4.33, total: 333.45, total_usd: 72111.55,
        token0: {symbol: 'WBNB', name: 'Wrapped BNB', address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'}, token1: {symbol: 'BUSD', name: 'Binance USD', address: '0x55d398326f99059ff775485246999027b3197955'},
        maker_addr: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
        tx_addr: '0xd2486b717dd2426729f48302b9b6a2e1b67a70ab8796568a36745f62f4ad3bff',
        pair_addr: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16',
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
      {id: 1, network: 'bsc', name: 'BIBA', price: 0.0021, percent_5_holders: 23.44, change_7d: 4112445.11,  change_30d: -2144771.22, market_cap: 23040111.22, address: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'}
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
  const lastTx = payload.tx || 0
  const { data } = await axios.get(`xhr/txs?chain_id=${chainId}&pair_id=${pairId}&block_id=${lastBlockId}&tx=${lastTx}`, {
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

export const fetchLiquidityChart = async ({chainId, pairId}) => {
  // await delay(500)
  // return { data: {success: true, result: [
  //       { time: '2018-10-19', value: 35.98 },
  //       { time: '2018-10-22', value: 35.75 },
  //       { time: '2018-10-23', value: 35.65 },
  //       { time: '2018-10-24', value: 34.12 },
  //       { time: '2018-10-25', value: 35.84 },
  //       { time: '2018-10-26', value: 35.24 },
  //       { time: '2018-10-29', value: 35.99 },
  //       { time: '2018-10-30', value: 37.71 },
  //       { time: '2018-10-31', value: 38.14 },
  //       { time: '2018-11-01', value: 37.95 },
  //       { time: '2018-11-02', value: 37.66 },
  //       { time: '2018-11-05', value: 38.02 },
  //       { time: '2018-11-06', value: 37.73 },
  //       { time: '2018-11-07', value: 38.30 },
  //       { time: '2018-11-08', value: 38.30 },
  //       { time: '2018-11-09', value: 38.34 },
  //       { time: '2018-11-12', value: 38.00 },
  //       { time: '2018-11-13', value: 37.72 },
  //       { time: '2018-11-14', value: 38.29 },
  //       { time: '2018-11-15', value: 38.49 },
  //       { time: '2018-11-16', value: 38.59 },
  //       { time: '2018-11-19', value: 38.18 },
  //       { time: '2018-11-20', value: 36.76 },
  //       { time: '2018-11-21', value: 37.51 },
  //       { time: '2018-11-23', value: 37.39 },
  //       { time: '2018-11-26', value: 37.77 },
  //       { time: '2018-11-27', value: 38.36 },
  //       { time: '2018-11-28', value: 39.06 },
  //       { time: '2018-11-29', value: 39.42 },
  //       { time: '2018-11-30', value: 39.01 },
  //       { time: '2018-12-03', value: 39.15 },
  //       { time: '2018-12-04', value: 37.69 },
  //       { time: '2018-12-06', value: 37.88 },
  //       { time: '2018-12-07', value: 37.41 },
  //       { time: '2018-12-10', value: 37.35 },
  //       { time: '2018-12-11', value: 36.84 },
  //       { time: '2018-12-12', value: 36.98 },
  //       { time: '2018-12-13', value: 36.76 },
  //       { time: '2018-12-14', value: 36.34 },
  //       { time: '2018-12-17', value: 36.21 },
  //       { time: '2018-12-18', value: 35.65 },
  //       { time: '2018-12-19', value: 35.19 },
  //       { time: '2018-12-20', value: 34.62 },
  //       { time: '2018-12-21', value: 33.75 },
  //       { time: '2018-12-24', value: 33.07 },
  //       { time: '2018-12-26', value: 34.14 },
  //       { time: '2018-12-27', value: 34.47 },
  //       { time: '2018-12-28', value: 34.35 },
  //       { time: '2018-12-31', value: 34.05 },
  //       { time: '2019-01-02', value: 34.37 },
  //       { time: '2019-01-03', value: 34.64 },
  //       { time: '2019-01-04', value: 35.81 },
  //       { time: '2019-01-07', value: 35.43 },
  //       { time: '2019-01-08', value: 35.72 },
  //       { time: '2019-01-09', value: 36.06 },
  //       { time: '2019-01-10', value: 35.82 },
  //       { time: '2019-01-11', value: 35.63 },
  //       { time: '2019-01-14', value: 35.77 },
  //       { time: '2019-01-15', value: 35.83 },
  //       { time: '2019-01-16', value: 35.90 },
  //       { time: '2019-01-17', value: 35.91 },
  //       { time: '2019-01-18', value: 36.21 },
  //       { time: '2019-01-22', value: 34.97 },
  //       { time: '2019-01-23', value: 36.89 },
  //       { time: '2019-01-24', value: 36.24 },
  //       { time: '2019-01-25', value: 35.78 },
  //       { time: '2019-01-28', value: 35.37 },
  //       { time: '2019-01-29', value: 36.08 },
  //       { time: '2019-01-30', value: 35.43 },
  //       { time: '2019-01-31', value: 36.57 },
  //       { time: '2019-02-01', value: 36.79 },
  //       { time: '2019-02-04', value: 36.77 },
  //       { time: '2019-02-05', value: 37.15 },
  //       { time: '2019-02-06', value: 37.17 },
  //       { time: '2019-02-07', value: 37.68 },
  //       { time: '2019-02-08', value: 37.60 },
  //       { time: '2019-02-11', value: 37.00 },
  //       { time: '2019-02-12', value: 37.24 },
  //       { time: '2019-02-13', value: 37.03 },
  //       { time: '2019-02-14', value: 37.26 },
  //       { time: '2019-02-15', value: 37.77 },
  //       { time: '2019-02-19', value: 37.55 },
  //       { time: '2019-02-20', value: 37.79 },
  //       { time: '2019-02-21', value: 38.47 },
  //       { time: '2019-02-22', value: 38.61 },
  //       { time: '2019-02-25', value: 38.57 },
  //       { time: '2019-02-26', value: 38.80 },
  //       { time: '2019-02-27', value: 38.53 },
  //       { time: '2019-02-28', value: 38.67 },
  //       { time: '2019-03-01', value: 39.10 },
  //       { time: '2019-03-04', value: 38.73 },
  //       { time: '2019-03-05', value: 38.72 },
  //       { time: '2019-03-06', value: 38.61 },
  //       { time: '2019-03-07', value: 38.38 },
  //       { time: '2019-03-08', value: 38.19 },
  //       { time: '2019-03-11', value: 39.17 },
  //       { time: '2019-03-12', value: 39.49 },
  //       { time: '2019-03-13', value: 39.56 },
  //       { time: '2019-03-14', value: 39.87 },
  //       { time: '2019-03-15', value: 40.47 },
  //       { time: '2019-03-18', value: 39.92 },
  //       { time: '2019-03-19', value: 39.78 },
  //       { time: '2019-03-20', value: 39.47 },
  //       { time: '2019-03-21', value: 40.05 },
  //       { time: '2019-03-22', value: 39.46 },
  //       { time: '2019-03-25', value: 39.18 },
  //       { time: '2019-03-26', value: 39.63 },
  //       { time: '2019-03-27', value: 40.21 },
  //       { time: '2019-03-28', value: 40.42 },
  //       { time: '2019-03-29', value: 39.98 },
  //       { time: '2019-04-01', value: 40.31 },
  //       { time: '2019-04-02', value: 40.02 },
  //       { time: '2019-04-03', value: 40.27 },
  //       { time: '2019-04-04', value: 40.41 },
  //       { time: '2019-04-05', value: 40.42 },
  //       { time: '2019-04-08', value: 40.71 },
  //       { time: '2019-04-09', value: 41.04 },
  //       { time: '2019-04-10', value: 41.08 },
  //       { time: '2019-04-11', value: 41.04 },
  //       { time: '2019-04-12', value: 41.30 },
  //       { time: '2019-04-15', value: 41.78 },
  //       { time: '2019-04-16', value: 41.97 },
  //       { time: '2019-04-17', value: 42.57 },
  //       { time: '2019-04-18', value: 42.43 },
  //       { time: '2019-04-22', value: 42.00 },
  //       { time: '2019-04-23', value: 41.99 },
  //       { time: '2019-04-24', value: 41.85 },
  //       { time: '2019-04-25', value: 42.93 },
  //       { time: '2019-04-26', value: 43.08 },
  //       { time: '2019-04-29', value: 43.45 },
  //       { time: '2019-04-30', value: 43.53 },
  //       { time: '2019-05-01', value: 43.42 },
  //       { time: '2019-05-02', value: 42.65 },
  //       { time: '2019-05-03', value: 43.29 },
  //       { time: '2019-05-06', value: 43.30 },
  //       { time: '2019-05-07', value: 42.76 },
  //       { time: '2019-05-08', value: 42.55 },
  //       { time: '2019-05-09', value: 42.92 },
  //       { time: '2019-05-10', value: 43.15 },
  //       { time: '2019-05-13', value: 42.28 },
  //       { time: '2019-05-14', value: 42.91 },
  //       { time: '2019-05-15', value: 42.49 },
  //       { time: '2019-05-16', value: 43.19 },
  //       { time: '2019-05-17', value: 43.54 },
  //       { time: '2019-05-20', value: 42.78 },
  //       { time: '2019-05-21', value: 43.29 },
  //       { time: '2019-05-22', value: 43.30 },
  //       { time: '2019-05-23', value: 42.73 },
  //       { time: '2019-05-24', value: 42.67 },
  //       { time: '2019-05-28', value: 42.75 },
  //     ]} }
  return await axios.get(`xhr/liquidity_chart?chain_id=${chainId}&pair_id=${pairId}`);
}


export const fetchSearch = async (query, categories = null) => {
  const cats = categories ? `&categories=${categories}` : ''
  return await axios.get(`search?q=${query}${cats}`);

  // return { data: {
  //     success: true, result: [
  //       { type: 'entity', id: 'binance', name: 'Binance' },
  //       { type: 'token', id: '0x1234', name: 'Biba', address: '0x25412r3rd332r4ft5f46f23r111' },
  //       { type: 'wallet', id: '0x5678', name: '0x5678', address: '0x5678' }
  //     ]
  //   }}
}

export const fetchEntity = async (id) => {
  return await axios.get(`entity/${id}`);
  // await delay(500)
  // return { data: {
  //   success: true, result: { type: 'entity', id: '1234-1234-1234-1234', name: 'Binance Entity' }
  // }}
}

export const fetchAddress = async (id) => {
  return await axios.get(`address/${id}`);
  // await delay(500)
  // if(id === '0x1234')
  //   return { data: { success: true, result: { type: 'token', name: 'BIBA', id: '1245-12453-152325-34234', address: '0x25412r3rd332r4ft5f46f23r' } }}
  // else
  //   return { data: { success: true, result: { type: 'wallet', name: '0x5678', id: '2342-2422-2222-3333', address: '0x5678' } }}
}

/** Private Labels */
export const fetchPrivateLabels = async (payload) => {
  return await axios.post(`xhr/private/labels`, payload);
}
export const savePrivateLabel = async (payload) => {
  return await axios.post(`xhr/private/label/save`, payload);
}
export const removePrivateLabel = async (id) => {
  return await axios.delete(`xhr/private/label/${id}`);
}

/** Private Entities */
export const fetchPrivateEntities = async (payload) => {
  return await axios.post(`xhr/private/entities`, payload);
}
export const getPrivateEntity = async (uuid) => {
  return await axios.get(`xhr/private/entities/${uuid}`);
}
export const searchEntities = async (query) => {
  return await axios.get(`xhr/search-entity?q=${query}`);
}
export const savePrivateEntity = async (payload) => {
  const isEdit = !!payload.has('uuid') && payload.get('uuid') !== 'null'

  return await axios.post(`entity${isEdit ? '/'+payload.get('uuid') : '' }`, payload, {
    headers: { "Content-Type": "multipart/form-data" } // for send file
  });
}
export const removePrivateEntity = async (uuid) => {
  return await axios.delete(`entity/${uuid}`);
}

/** Segments */
export const fetchSegments = async () => {
  return await axios.get(`xhr/private/segments/`);
  // await delay(500)
  // return { data: { success: true, result: [
  //   { id: 1, name: 'My Segment 1' },
  //   { id: 2, name: 'My Segment 2' },
  //   { id: 3, name: 'My Segment 3' },
  // ]}}
}
export const fetchSegmentTXs = async (payload) => {
  return await axios.post(`xhr/private/segment/${payload.id}/txs`, payload);
  // await delay(500)
  // return { data: { success: true, result: {
  //   total: 1,
  //   items: [
  //     { id: 1, date: '2023-11-09 22:33:44', amount: '1111111111', usd: '2222222.22', token: 'BIBA', from: '0x0000000000000000000000000000000000000000', to: '0x1111111111111111111111111111111111111111' },
  //   ]
  // }}}
}
export const getSegmentInfo = async (id) => {
  return await axios.get(`xhr/private/segment/${id}`);
  // await delay(500)
  // return { data: { success: true, result: {
  //   id: 4,
  //   name: 'Segment 4',
  //   description: 'qqq',
  //   main_address: '0x0000000000000000000000000000000000000001',
  //   from_address: '',
  //   to_address: '',
  //   chain_id: 2,
  //   min_value: '0',
  //   max_value: '1000',
  //   tokens: [
  //     { id: 1, name: 'DogeCoin', symbol: 'DOGE' }
  //   ],
  // }}}
}
export const saveSegment = async (payload) => {
  return await axios.post(`xhr/private/segment/save`, payload);
  // await delay(500)
  // return { data: { success: true, result: {}}}
}
export const removeSegment = async (id) => {
  return await axios.delete(`xhr/private/segment/${id}`);
  // await delay(500)
  // return { data: { success: true, result: {}}}
}

/** Dashboard */
export const fetchDashboards = async () => {
  return await axios.get('dashboards');
  // await delay(500)
  // return { data: { success: true, result: [
  //   {name: 'Default', id: 1, widgets: []},
  //   {name: 'My Dash 2', id: 2, widgets: []},
  // ] }}
}
export const saveDashboard = async (payload) => {
  const isEdit = !!payload.id
  return await axios.post(`dashboard${isEdit ? '/'+payload.id : '' }`, payload);
}
export const removeDashboard = async (id) => {
  return await axios.delete(`dashboard/${id}`);
}

export const fetchDexAnalyzeTxs = async () => {
  // return await axios.get('dexAnalyzeTxs');
  await delay(500)
  return { data: { success: true, result: {
    items: [
      {
        wallet: '0x0000000000000000000000000000000000000000',
        profit: 500,
        roi: 50,
        buy_date: '2023-09-20 14:22:33',
        buy_tx_id: '0x0000000000000000000000000000000000000000',
        buy_amount: 10,
        buy_price: 100,
        buy_total: 1000,
        sell_date: '2023-09-22 15:22:33',
        sell_tx_id: '0x0000000000000000000000000000000000000000',
        sell_amount: 10,
        sell_price: 150,
        sell_total: 1500
      },
      {
        wallet: '0x0000000000000000000000000000000000000000',
        profit: 500,
        roi: 50,
        buy_date: '2023-09-21 14:22:33',
        buy_tx_id: '0x0000000000000000000000000000000000000000',
        buy_amount: 10,
        buy_price: 100,
        buy_total: 1000,
        sell_date: '2023-09-23 15:22:33',
        sell_tx_id: '0x0000000000000000000000000000000000000000',
        sell_amount: 10,
        sell_price: 150,
        sell_total: 1500
      },
    ],
    totalItems: 2,
    total: {
      profit: 1000,
      roi: 50,
      buy_amount: 20,
      buy_price: 100,
      buy_total: 2000,
      sell_amount: 20,
      sell_price: 150,
      sell_total: 3000,
    }
  }}}
}

export const fetchDexAnalyzeGroupTxs = async (payload) => {
  return axios.post('xhr/analyze', payload);
  // await delay(500)
  // return { data: { success: true, result: {
  //   items: [
  //     {
  //       wallet: '0x0000000000000000000000000000000000000000',
  //       profit: 500,
  //       roi: 50,
  //       buy_amount: 10,
  //       buy_price: 100,
  //       buy_total: 1000,
  //       sell_amount: 10,
  //       sell_price: 150,
  //       sell_total: 1500
  //     },
  //     {
  //       wallet: '0x0000000000000000000000000000000000000000',
  //       profit: 500,
  //       roi: 50,
  //       buy_amount: 10,
  //       buy_price: 100,
  //       buy_total: 1000,
  //       sell_amount: 10,
  //       sell_price: 150,
  //       sell_total: 1500
  //     },
  //   ],
  //   totalItems: 2,
  //   total: {
  //     profit: 1000,
  //     roi: 50,
  //     buy_txs: 4,
  //     buy_amount: 20,
  //     buy_price: 100,
  //     buy_total: 2000,
  //     buy_txs: 4,
  //     sell_amount: 20,
  //     sell_price: 150,
  //     sell_total: 3000,
  //   }
  // }}}
}

export const fetchDexLiquidityTxs = async (payload) => {
  return await axios.post('xhr/liquidity_txs', payload);
  await delay(500)
  return { data: { success: true, result: {
    items: [
      {
        wallet: '0x0000000000000000000000000000000000000000',
        date: '2023-09-22 12:22:22',
        type: 'adds',
        token0_amount: 1122444,
        token0_total: 80000,
        token1_amount: 80000,
        token1_total: 80000,
        total: 160000,
      },
      {
        wallet: '0x0000000000000000000000000000000000000000',
        date: '2023-09-12 12:22:22',
        type: 'removes',
        token0_amount: 1122444,
        token0_total: 80000,
        token1_amount: 80000,
        token1_total: 80000,
        total: 160000,
      },
    ],
    totalItems: 2,
    total: {
      token0_amount: 1122444*2,
      token0_total: 80000*2,
      token1_amount: 80000*2,
      token1_total: 80000*2,
      total: 160000*2,
    }
  }}}
}

export const fetchDexPairWallets = async () => {
  // return await axios.get('dexPairWallets');
  await delay(500)
  return { data: { success: true, result: {
    items: [
      {
        wallet: '0x0000000000000000000000000000000000000000',
        removed: 1,
        count_adds: 7,
        count_removes: 1,
        count_total: 8,
        token0_was: 100000,
        token0_now: 110000,
        token0_profit: 10000,
        token0_roi: 10,
        token1_was: 100000,
        token1_now: 110000,
        token1_profit: 10000,
        token1_roi: 10,
      },
      {
        wallet: '0x0000000000000000000000000000000000000000',
        removed: 0,
        count_adds: 5,
        count_removes: 2,
        count_total: 7,
        token0_was: 100000,
        token0_now: 110000,
        token0_profit: 10000,
        token0_roi: 10,
        token1_was: 100000,
        token1_now: 110000,
        token1_profit: 10000,
        token1_roi: 10,
      },
    ],
    totalItems: 2,
    total: {
      count_adds: 12,
      count_removes: 3,
      count_total: 15,
      token0_was: 100000*2,
      token0_now: 110000*2,
      token0_profit: 10000*2,
      token0_roi: 10,
      token1_was: 100000*2,
      token1_now: 110000*2,
      token1_profit: 10000*2,
      token1_roi: 10,
    }
  }}}
}
