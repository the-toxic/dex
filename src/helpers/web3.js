
// https://docs.walletconnect.com/2.0/web/about-web3modal
// https://web3modal.com/
// https://www.google.com/search?q=WalletConnect+web3modal+vue&oq=WalletConnect+web3modal+vue&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigATIHCAQQIRigAdIBCDU5OTJqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8




// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import router from "@/router"
// import {ethers} from 'ethers'
//
// import { useMainStore } from "@/store/mainStore";
// import { useWalletStore } from "@/store/walletStore";
// const mainStore = useMainStore()
// const walletStore = useWalletStore()
//
// export const hexToNumber = (hex) => +ethers.utils.formatUnits(hex, 'wei')
// export const hexToEther = (hex) => +ethers.utils.formatEther(hex)
//
// // wei - 0 zeros, gwei - 8 zeros, ether - 18 zeros
// // ethers.utils.formatUnits('0x05', 'wei') == 5 == ethers.utils.formatUnits('0x05', '0')
// // ethers.utils.formatUnits(fee.maxFeePerGas, "gwei") // from hex
// // ethers.utils.formatEther('0x016345785d8a0000') == 0.1 ETH == ethers.utils.formatUnits('0x016345785d8a0000') == ethers.utils.formatUnits('0x016345785d8a0000', 'ether') == ethers.utils.formatUnits('0x016345785d8a0000', '18')
// // ethers.utils.parseEther("0.1") == ethers.utils.parseUnits('0.1', 'ether') == ethers.utils.parseUnits('0.1', '18') // add 18 zeros to BigNumber hex 0x016345785d8a0000
// // ethers.utils.parseUnits('5', '0') // to BigNumber hex 0x05
//
// // const tx = signer.sendTransaction({ to: "0x544F151B776c15894AB9A368f7279e0C01dd50aF", value: ethers.utils.parseEther("0.025") });
// // provider.getNetwork()
// // await provider.getFeeData()
//
// const isDev = import.meta.env.MODE !== 'production' || window.location.host === 'hazb.app'
// let provider, contract, signer, contractWithSigner
//
// const providerOptions = {
//   walletconnect: {
//     package: WalletConnectProvider,
//     options: {
//       infuraId: import.meta.env.VITE_APP_INFURA_ID
//     }
//   },
//   coinbasewallet: {
//     package: CoinbaseWalletSDK,
//     options: {
//       appName: "HAZB DEX",
//       appLogoUrl: 'https://hazb.com/favicon.png',
//       infuraId: import.meta.env.VITE_APP_INFURA_ID,
//       // chainId: 1 // this call event chainChanged - wtf
//     }
//   },
//   // import Fortmatic from "fortmatic";
//   // fortmatic: {
//   // 	package: Fortmatic, // required
//   // 	options: {
//   // 		key: isDev ? "pk_test_4B520B94EB555675" : "pk_live_D5DE5E9EF9C9BE3D",
//   // 		network: {
//   // 			rpcUrl: 'https://rpc-mainnet.maticvigil.com',
//   // 			chainId: 137
//   // 		}
//   // 	}
//   // }
// };
// const web3Modal = new Web3Modal({
//   // network: "mainnet", // optional
//   cacheProvider: true, // optional
//   providerOptions, // required
//   theme: {
//     border: "#141722", // modal border
//     background: "#141722",
//     hover: "#0e1118",
//     main: "#fff", // title
//     secondary: "#d7d7d7", // subtitle
//   }
// });
// console.log('web3Modal', web3Modal)
//
// if (web3Modal.cachedProvider) { // if before will connected wallet, load provider
//   web3Modal.connect().then(connectProvider);
// }
// // web3Modal.onClose(console.log)
// async function connectProvider(instance) { // instance === window.ethereum (metamask)
//   console.log('instance', instance)
//   provider = new ethers.providers.Web3Provider(instance);
//   console.log('provider', provider)
//   // window.provider = provider
//
//   // contract = new ethers.Contract(MINT_CONTRACT, ABI, provider);
//   // signer = provider.getSigner()
//   // contractWithSigner = contract.connect(signer);
//
//   // const accounts = await provider.listAccounts()
//   // const network = await provider.getNetwork() // network.chainId
//   // console.log(accounts, network)
//
//   startApp().then()
// }
//
// let networks = {
//   'eth': {id: '0x1', name: 'Ethereum main network'}, // 1
//   'eth_test': {id: '0x4', name: 'Rinkeby'}, // 3 - Ropsten, 4 - Rinkeby
//   'bsc': {id: '0x38', name: 'Binance Smart Chain'}, // 56
//   'bsc_test': {id: '0x61', name: 'Binance Smart Chain - Testnet'}, // 97
//   'polygon': {id: '0x89', name: 'Polygon Mainnet'}, // 137
//   'polygon_test': {id: '0x13881', name: 'Polygon Testnet Mumbai'}, // 80001
// }
//
// async function startApp() {
//   let accounts = await provider.send('eth_accounts', []);
//   // console.log('connected accounts on load page', accounts)
//   if(!accounts.length && store.getters['wallet/account']) {
//     await walletStore.logOut(true)
//   }
//   // if(walletStore.account) {
//   // await checkChainId() // todo временно убрал, проверка для гаража
//   // }
//
//   provider.provider.on('connect', function() {
//     console.log('on connect')
//     startApp();
//
//   }).on('disconnect', function(error) { // on remove link in Mobile App or chain change or network error
//     console.log('on disconnect', error)
//     disconnect(true)
//
//   }).on('chainChanged', function(chainId) {
//     console.log('on chainChanged', chainId)
//     handleChainChanged(chainId)
//
//   }).on('accountsChanged', function(accounts) { // call after remove account in
//     console.log('on accountsChanged', accounts)
//     handleAccountChanged(accounts)
//
//   }).on('message', function(message) { // ??
//     console.log('Wallet message: ', message)
//   })
// }
//
// // export async function checkChainId(chainName, logoutOnError = true) {
// //   return new Promise(resolve => setTimeout(async () => {
// //     // provider.provider.request()
// //     if(!provider) {
// //       await mainStore.showAlert(`Please connect your Wallet`)
// //       resolve(false); return
// //     }
// //     let chainId = await provider.send('eth_chainId', []); // await provider.getNetwork().chainId
// //
// //     if (+chainId !== +networks[chainName].id) {
// //       if(logoutOnError) await walletStore.logOut(false)
// //       if(provider.connection.url === 'metamask') { // wallet connect
// //         await mainStore.showAlert(`Please connect your Wallet to ${networks[chainName].name} network`)
// //       } else {
// //         await mainStore.showAlert(`Please switch your Wallet network to ${networks[chainName].name} and re-login on site.`)
// //       }
// //       resolve(false); return
// //     }
// //     resolve(true)
// //   }, provider ? 0 : 1000));
// // }
//
// async function handleAccountChanged(accounts) { // if change account in metamask or remove connect metamask to site
//   web3Modal.clearCachedProvider(); // fix bug on call site connect after remove last account in metamask
//
//   if(walletStore.account) {
//     walletStore.logOut(false).then()
//     mainStore.showAlert({msg: `Account is changed. Please reconnect your wallet.`, color: 'info'}).then()
//   }
// }
//
// async function handleChainChanged(chainId) {
//   web3Modal.clearCachedProvider();
//
//   if(walletStore.account) {
//     walletStore.logOut(false).then()
//     mainStore.showAlert({msg: `Network is changed. Please reconnect your wallet.`, color: 'info'}).then()
//   }
// }
//
// export async function requestSign() {
//   if(!provider) return false
//   console.log('sign start')
//
//   const accounts = await provider.send('eth_accounts', []);
//   if(!accounts.length) {
//     await mainStore.showAlert(`Please connect Wallet.`)
//     return false
//   }
//   // const jwt = walletStore.jwt
//   // if(!jwt) {
//   //   await mainStore.showAlert(`Session expired. Try connect Wallet`) // хз нужно ли
//   //   return false
//   // }
//
//   let sign_phrase
//   try {
//     // sign_phrase = await web3.eth.personal.sign("Cryptotanks\n\n" + jwt, accounts[0])
//     // sign_phrase = await provider.provider.request('personal_sign', [accounts[0], "Cryptotanks\n\n" + jwt]);
//     if(provider.connection.url !== 'metamask') { // wallet-connect
//       await mainStore.showAlert({msg: 'To continue, open your wallet`s app and confirm Sign Request', color: 'info'})
//     }
//     sign_phrase = await provider.send('personal_sign', ["Cryptotanks\n\n" + jwt, accounts[0]]);
//     console.log('sign_phrase', sign_phrase)
//   } catch (e) {
//     console.error(e)
//     if(e.code === 4001) { // on close metamask window
//       await mainStore.showAlert('Process is interrupted. Your Wallet is not signed with Cryptotanks.')
//       return false
//     }
//   }
//   if(!sign_phrase) {
//     await mainStore.showAlert('Error on sign your Wallet on Cryptotanks.')
//     return false
//   }
//
//   await walletStore.sign(sign_phrase)
//
//   return true
// }
//
// export async function connect() {
//   await web3Modal.connect().then(connectProvider);
//
//   // if(!await checkChainId('eth', true)) return // todo временно вырубил проверку гаража
//
//   let accounts = await provider.send('eth_accounts', []);
//   // await provider.send('wallet_requestPermissions', [{eth_accounts: {}}]); // force call metamask dialog for select account
//
//   if(accounts.length) { // если уже подключен, дергаем sign
//
//     const providerName = provider.provider.isMetaMask ? 'MetaMask Extension'
//       : (provider.provider.isCoinbaseWallet && provider.provider.qrUrl ? 'Coinbase Mobile App'
//         : (provider.provider.isCoinbaseWallet ? 'Coinbase Extension'
//           : (provider.provider?.walletMeta?.description || provider.provider?.walletMeta?.name)))
//
//     await walletStore.login({
//       account: accounts[0],
//       // jwt: result.jwt,
//       // refresh: result.refresh,
//       // expired: result.expired_at,
//       providerName
//     })
//
//     return true
//
//   } else {
//     try {
//       /*const accounts = */ await provider.send('eth_requestAccounts', [])
//       return true
//
//     } catch (e) {
//       if (e.code === 4001) { // close window connect
//         await mainStore.showAlert('Process is interrupted. Try again connect Wallet.')
//       } else if(e.code && e.code === -32002) {
//         await mainStore.showAlert('It is necessary to complete the registration in the Wallet. Click on the extension icon and continue registration.')
//       } else if(e.code && e.code === -32603) {
//         await mainStore.showAlert('Wallet internal error.')
//       } else {
//         await mainStore.showAlert(`Undefined error with code ${e.code}. Please contact with support.`)
//       }
//       return false
//     }
//
//   }
//   // console.log('до логина', accounts)
//   // await login(accounts) // не нужно, т.к. сразу при подключении акка сам вызывается on account change
// }
//
// export async function disconnect(fromApp = false) {
//   console.log('disconnect from app:', fromApp, provider?.provider)
//   // console.log('cachedProvider', web3Modal.cachedProvider)
//   // может лучше проверять через наличие provider.provider?.walletMeta, он есть если через приложение вошли
//   // if(provider && !fromApp && !provider.provider.isMetaMask && !provider.provider.isCoinbaseWallet) { // if not extension Metamask/Coinbase && if logout from site, need disconnect provider.
//   if(!fromApp && provider && ('close' in provider.provider)) { // if not extension Metamask/Coinbase && if logout from site, need disconnect provider.
//     console.log('call close() on disconnect')
//     provider.provider.close() // разлогиниваем приложение
//     // return // after close() provider generate event 'on disconnect' and method call again with argument fromApp=true
//   }
//   web3Modal.clearCachedProvider() // on next connect call modal with select provider
//   await walletStore.logOut(true)
// }
