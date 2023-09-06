<template>
	<div class="overflow-x-auto">
		<div class="txsTableHead" style="min-width: 1450px">
			<div class="txsTableTd">Date</div>
			<div class="txsTableTd">Type</div>
			<div class="txsTableTd">Price</div>
			<div class="txsTableTd">{{ chartStore.leftToken }}</div>
			<div class="txsTableTd">{{ chartStore.rightToken }}</div>
			<div class="txsTableTd" style="flex-grow: 2">Aggregator</div>
			<div class="txsTableTd">Maker</div>
			<div class="txsTableTd">Receiver</div>
			<div class="txsTableTd">Actions</div>
		</div>

		<div v-bind="containerProps" style="height: 600px; min-width: 1450px">
			<div v-bind="wrapperProps">
				<div v-for="item in list" :key="item.index" class="txsTableRow" >
					<div class="txsTableTd" :class="item.type === 'buy' ? 'buyTd' : 'sellTd'">{{ item.data.parsedDate }}</div>
					<div class="txsTableTd text-uppercase" :class="item.data.type === 'buy' ? 'buyTd' : 'sellTd'">{{ item.data.type }}</div>
					<div class="txsTableTd" :class="item.data.type === 'buy' ? 'buyTd' : 'sellTd'">{{ priceFormatter(item.data.parsedPrice) }}</div>
					<div class="txsTableTd" :class="item.data.type === 'buy' ? 'buyTd' : 'sellTd'">{{ priceFormatter(item.data.amount_token0) }}</div>
					<div class="txsTableTd" :class="item.data.type === 'buy' ? 'buyTd' : 'sellTd'">{{ priceFormatter(item.data.amount_token1) }}</div>
					<div class="txsTableTd text-center" style="flex-grow: 2">
						<a v-if="item.data.router.address" :href="`${blockchainDomain}/address/${item.data.router.address}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ item.data.router.title }}</a>
						<span v-else>{{ item.data.router.title }}</span>
					</div>
					<div class="txsTableTd"><a :href="`${blockchainDomain}/address/${item.data.maker}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.data.maker) }}</a></div>
					<div class="txsTableTd"><a :href="`${blockchainDomain}/address/${item.data.receiver}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ shortAddress(item.data.receiver) }}</a></div>
					<div class="txsTableTd"><a :href="`${blockchainDomain}/tx/${item.data.tx}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">Show Tx</a></div>
				</div>
				<div>
					<div v-if="loading" class="text-center flex-fill"><v-skeleton-loader type="table-tbody" /> <v-skeleton-loader type="table-tbody" /></div>
					<div v-else-if="!loading && !rows.length" class="text-center flex-fill">No activity</div>
					<div v-if="!loading && rows.length" v-intersect="infiniteScrolling" class="text-center flex-fill">
						<v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-2" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref, watch } from "vue";
	import { useVirtualList } from '@vueuse/core'
	import { priceFormatter } from "@/helpers/common";

	import { useChartStore } from "@/store/chartStore";
	const chartStore = useChartStore()

	import { shortAddress } from "@/helpers/mixins";
	import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

	/** DATA */
	const loading = ref(true)
	const tzOffset = -(new Date().getTimezoneOffset()) * 60

	/** COMPUTED */
	const rows = computed(() => {
		if(loading.value) return []
		// const items = Object.assign([], chartStore.lastTXs)

		return chartStore.lastTXs.map(item => {
			item.parsedPrice = priceFormatter(+item.amount_token1/+item.amount_token0)
			item.parsedDate = new Date((item.date + tzOffset) * 1000).toISOString().slice(0, 19).split('T').join(' ')
			item.router = chartStore.exchangesList.hasOwnProperty(item.router_id) ? chartStore.exchangesList[item.router_id] : { title: '—', address: null }
			return item
		})
		// return this.lastTXs
	})

	const { list, containerProps, wrapperProps } = useVirtualList(
		rows,
		{
			itemHeight: 30,
			// overscan: 10,
		},
	)

	/** WATCH */
	watch(() => chartStore.activeSymbol, async (newVal, oldVal) => {
		if(!newVal) return
		loading.value = true
		await chartStore.loadHistoryTable({
			chain_id: newVal['chain_id'],
			pair_id: newVal['pair_id']
		})
		loading.value = false
	})

	/** METHODS */
	const infiniteScrolling = (isIntersecting, entries, observer) => {
		if (entries[0].isIntersecting) {
			console.log('Load Oldest TXs on Scroll...')
			chartStore.loadOldTXs().then()
		}
	}

	const blockchainDomain = computed(() => {return chartStore.activeSymbol['type'] === 'BSC' ? 'https://bscscan.com' : 'https://etherscan.io'})
</script>

<style>
	.txsTableHead { /* thead tr */
		display: flex;
		padding: 6px 12px;
		background: #2d3244;
		font-weight: bold;
	}
	.txsTableRow { /* tbody tr */
		display: flex;
		padding: 3px 12px;
		&:hover { background: #0f171e }

	}
	.txsTableTd { /* td */
		flex: 1;
		white-space: nowrap;
		text-align: center;
		&.buyTd { color: #27a69a }
		&.sellTd { color: #f0534f }
		& a:hover {
			text-decoration: underline !important;
		}
	}
</style>
