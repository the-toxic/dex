<template>
	<div class="overflow-x-auto">

		<div v-bind="containerProps" style="height: 600px; min-width: 1450px">
			<table v-bind="wrapperProps" class="txsTable relative">
				<thead class="txsTableHead" style="position:sticky; top:0">
					<tr>
						<td class="txsTableTd px-12">Date</td>
						<td class="txsTableTd">Type</td>
						<td class="txsTableTd">Price</td>
						<td class="txsTableTd">{{ chartStore.leftToken }}</td>
						<td class="txsTableTd">{{ chartStore.rightToken }}</td>
						<td class="txsTableTd">Aggregator</td>
						<td class="txsTableTd" style="width: 400px">Maker</td>
						<td class="txsTableTd" style="width: 400px">Receiver</td>
						<td class="txsTableTd px-4">Actions</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in list" :key="item.index" class="txsTableRow" :class="item.data.type === 'buy' ? 'buyRow' : 'sellRow'">
						<td class="txsTableTd">{{ item.data.parsedDate }}</td>
						<td class="txsTableTd text-uppercase">{{ item.data.type }}</td>
						<td class="txsTableTd">{{ formatNumber(item.data.parsedPrice, true) }}</td>
						<td class="txsTableTd">{{ formatNumber(item.data.amount_token0, true) }}</td>
						<td class="txsTableTd">{{ formatNumber(item.data.amount_token1, true) }}</td>
						<td class="txsTableTd text-center">
							<a v-if="item.data.router.address" :href="`${blockchainDomain}/address/${item.data.router.address}`" target="_blank" class="text-decoration-none" style="color:#2e7ebe;">{{ item.data.router.title }}</a>
							<span v-else>{{ item.data.router.title }}</span>
						</td>
						<td class="txsTableTd"><LabelAddress link :to="`${blockchainDomain}/address/${item.data.maker.address}`" :address="item.data.maker" target="_blank" /></td>
						<td class="txsTableTd"><LabelAddress link :to="`${blockchainDomain}/address/${item.data.receiver.address}`" :address="item.data.receiver" target="_blank" /></td>
						<td class="txsTableTd"><LabelAddress link :to="`${blockchainDomain}/tx/${item.data.tx}`" text="Show TX" target="_blank" /></td>
					</tr>
					<tr>
						<td colspan="9">
							<div v-if="loading" class="text-center"><v-skeleton-loader type="table-tbody" /> <v-skeleton-loader type="table-tbody" /></div>
							<div v-else-if="!loading && !rows.length" class="text-center py-4">No activity</div>
							<div v-if="!loading && rows.length" v-intersect="infiniteScrolling" class="text-center">
								<v-progress-circular :size="50" :width="4" color="white" indeterminate class="ma-3" />
							</div>
						</td>
					</tr>
				</tbody>

			</table>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref, watch } from "vue";
	import { useVirtualList } from '@vueuse/core'

	import { useChartStore } from "@/store/chartStore";
	const chartStore = useChartStore()
	const { activeSymbol } = storeToRefs(chartStore) // for use in watch

	import { shortAddress, formatNumber } from "@/helpers/mixins";
	import { storeToRefs } from "pinia";
	import LabelAddress from "@/components/UI/LabelAddress.vue";

	/** DATA */
	const loading = ref(true)
	const tzOffset = -(new Date().getTimezoneOffset()) * 60

	/** COMPUTED */
	const rows = computed(() => {
		if(loading.value) return []
		// const items = Object.assign([], chartStore.lastTXs)

		return chartStore.lastTXs.map(item => {
			item.parsedPrice = +item.amount_token1/+item.amount_token0
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
	watch(activeSymbol, async (newVal, oldVal) => {
	// watch(() => chartStore.activeSymbol, async (newVal, oldVal) => {
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

	const blockchainDomain = computed(() => {
		if(!activeSymbol.value) return ''
		return activeSymbol.value['type'] === 'BSC' ? 'https://bscscan.com' : 'https://etherscan.io'
	})
</script>

<style lang="scss">
	.txsTable {
		border-collapse: collapse;
		border-spacing: 0;
	}
	.txsTableHead { /* thead tr */
		//display: table-row;
		//padding: 6px 12px;
		background: #282833;
		font-weight: bold;
	}
	.txsTableRow { /* tbody tr */
		//display: table-row;
		height: 30px;
		//padding: 3px 12px;
		&.buyRow { background: rgb(11 153 129 / 25%); color: aquamarine; }
		&.sellRow { background: rgb(240 83 79 / 20%); color: #fb5c5c }
		&:hover { background: #292929 }
	}
	.txsTableTd { /* td */
		//display: table-cell;
		height: 30px;
		vertical-align: middle;
		white-space: nowrap;
		text-align: center;
		font-size: 14px;
		& a:hover {
			text-decoration: underline !important;
		}
	}
</style>
