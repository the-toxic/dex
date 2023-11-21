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
      {pair_id: '1', date: '2023-08-25 12:13:14', chain_id: 2, type: 'sell', pair_name: 'WBNB/USDT', quantity: 333.45, variation: 4.33, total: 333.45, total_usd: 72111.55,
        token0: {symbol: 'WBNB', name: 'Wrapped BNB', address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'}, token1: {symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059ff775485246999027b3197955'},
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
