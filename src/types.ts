export enum AppLayoutsEnum {
	default = "default",
	auth = "auth",
	empty = "empty",
}

export interface Chains {
  [id: number]: {
		id: number,
		name: string,
		icon_folder: string | null,
		native_symbol: string,
		native_symbol_price: number | null,
	}
}

export interface PairInfo {
	pair: {
		id: number,
		price: number,
		chain_id: number,
		address: string,
		created_at: string,
		created_by: string,
		token0_reserve: number,
		token1_reserve: number,
	},
	stats: { h1: PairInfoStats, h6: PairInfoStats, h12: PairInfoStats, h24: PairInfoStats }
	token0: TokenN,
	token1: TokenN,
}
export interface TokenN {
	address: string,
	created_at: string,
	created_by: string,
	decimals: number,
	description: string | null,
	id: number,
	is_coin: boolean,
	is_stable: boolean
	links: string[] | null
	name: string,
	symbol: string,
	tags: string[] | null,
	total_supply: number,
}

interface PairInfoStats {
	buy: number,
	buy_volume: number,
	buyers: number,
	makers: number,
	percent: number,
	price: number,
	sell: number,
	sell_volume: number,
	sellers: number,
	txs: number,
	volume: number,
}

export interface ChartSymbol {
	id: number,
	full_name: string,
	symbol: string,
	pair_id: number,
	pair_addr: string,
	chain_id: number,
	type: 'Ethereum' | 'BSC' | string,
	exchange: string,
	exchange_id: number,
	need_invert: boolean,
	is_coin: boolean,
	is_stable: boolean,
	tx_count: number,
	description?: string,
	token0: {id: number, symbol: "GFY", is_stable: false, is_coin: false},
	token1: {id: number, symbol: "GFY", is_stable: false, is_coin: false},
}

export interface LastTxsItem {
	amount_token0: number
	amount_token1: number
	block_id?: number
	date: number
	maker: Address,
	receiver: Address,
	router_id: number
	tx: string
	type: 'sell' | 'buy'
}

export interface Address {
	id?: number,
	address: string,
	entity: {id?: number, uuid: string, name: string },
	global_label: {id: number, label: string},
	local_label: {id: number, label: string}
}

export interface StreamingSubHandler {
  id: string,
  callback: (bar: StreamingBar) => {}
}
export interface StreamingBar {
  time: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume?: number,
  volume0?: number,
  volume1?: number,
}

export type AnalyzeGroupTxsItem = {
	buy_amount: number,
	buy_price: number,
	buy_total: number,
	buy_txs: number,
	profit: number,
	roi: number,
	sell_amount: number,
	sell_price: number,
	sell_total: number,
	sell_txs: number,
  wallet: Address
}

export type LiquidityTxsItem = {
	dttm: string,
	maker: Address,
	token0_amount: number,
	token1_amount: number,
}

import type { VDataTable } from 'vuetify/lib/components/index.mjs'
type ReadonlyHeaders = InstanceType<typeof VDataTable>['headers']
type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : never;
type ReadonlyDataTableHeader = UnwrapReadonlyArray<ReadonlyHeaders>;
type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> }
export type DataTableHeader = DeepMutable<ReadonlyDataTableHeader>;

// const headers: ReadonlyDataTableHeader[] = [...]
