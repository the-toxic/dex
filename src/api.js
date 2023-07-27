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


// const userData = {
// 	success: true,
// 	result: {
// 		user_id: '1q2w3e',
// 		email: 'test-user@gmail.com',
// 		token: '123'
// 	}
// }
const delay = async (ms) => await new Promise(resolve => setTimeout(() => {resolve(true)}, ms))

/** Auth module */

export async function signIn(payload){
  // return await axios.post(`auth/sign-in`, payload);
  await delay(500)
  return {data: {success: true, result: { need_invite: true, /*user: {email: 'qwe@qwe.cc'}*/ }}}
}
export async function signUp(payload){
  // return await axios.post(`auth/sign-up`, payload);
  await delay(500)
  return {data: {success: true}}
}
export async function resetPassword(payload){
  // return await axios.post(`auth/reset-password`, payload);
  await delay(500)
  return {data: {success: true}}
}

export async function otp(payload){
  // return await axios.post(`auth/otp`, payload);
  await delay(500)
  return {data: {success: true}}
}
export async function otpResend(payload){
  // return await axios.post(`auth/otp-resend`, payload);
  await delay(500)
  return {data: {success: true}}
}
export async function setPassword(payload){
  // return await axios.post(`auth/set-password`, payload);
  await delay(500)
  return {data: {success: true, result: { user: {email: 'qwe@qwe.cc'} }}}
}
export async function inviteRequest(payload){
  // return  await axios.post(`auth/invite`, payload);
  await delay(500)
  return {data: {success: true, result: { user: {email: 'qwe@qwe.cc'} }}}
}


/** User module */
export async function changePassword(payload){
  // return  await axios.post(`user/change-password`, payload);
  await delay(500)
  return {data: {success: true}}
}



/** Chart page */
export const searchPair = async (payload) => {
  const {data} = await axios.post(`xhr/search_pair`, payload, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}
export const fetchPairInfo = async (pairId) => {
  const {data} = await axios.get(`xhr/pair_info?pair_id=${pairId}`, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}
export const fetchHistoryTable = async (payload) => {
  const chainId = payload.chain_id
  const pairId = payload.pair_id
  const lastBlockId = payload.block_id || 0
  const {data} = await axios.get(`xhr/txs?chain_id=${chainId}&pair_id=${pairId}&block_id=${lastBlockId}`, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}
export const fetchHistoryCandles = async (body) => {
  const {data} = await axios.post(`xhr/limit_candles_history`, body, {
    headers: { 'x-session-id': chartStore().sessionId },
  });
  return data
}

export const fetchExchanges = async () => {
  const {data} = await axios.get(`xhr/routers`);
  return data
}

