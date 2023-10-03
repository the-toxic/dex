<template>
	<v-card rounded>
		<v-card-text>
			<v-text-field v-model="token0Input" variant="outlined" hide-details density="comfortable">
				<template v-slot:append-inner><span class="fs14">{{ token0.symbol }}</span></template>
			</v-text-field>
			<div class="text-center my-3">
				<v-icon icon="mdi-swap-vertical" size="large"/> <span v-if="!token1.is_stable">1 {{ nativeSymbolName }} = ${{ nativeSymbolPrice }}</span>
			</div>
			<v-text-field v-model="token1Input" variant="outlined" hide-details density="comfortable">
				<template v-slot:append-inner>
					<v-btn-toggle v-model="toUSD" density="compact">
						<v-btn :value="true" size="x-small" class="text-none">USD</v-btn>
						<v-btn :value="false" size="x-small" class="text-none">{{ token1.symbol }}</v-btn>
					</v-btn-toggle>
				</template>
			</v-text-field>
		</v-card-text>
	</v-card>
</template>
<script>
import { mapState } from "pinia";
import { useMainStore } from "@/store/mainStore";

export default {
	name: 'Converter',
	props: {
		token0: Object,
		token1: Object,
		rate: Number,
		chainId: Number
	},
	data() { return {
		token0Input: '',
		token1Input: '1',
		toUSD: false
	}},
	created() {
		setTimeout(() => this.calcToken0(), 500)
	},
	watch: {
		token0Input(newVal, oldVal) {
			// console.log('token0Input', newVal, oldVal)
			if(isNaN(+newVal) || typeof newVal === 'number') return
			this.token1Input = +this.token0Input * this.parsedRate
		},
		token1Input(newVal, oldVal) {
			// console.log('token1Input', newVal, oldVal)
			if(isNaN(+newVal) || typeof newVal === 'number') return
			this.token0Input = +this.token1Input / this.parsedRate
		},
		toUSD() {
			this.calcToken0()
		}
	},
	computed: {
		...mapState(useMainStore, {chains: 'chains'}),
		nativeSymbolPrice() {
			return this.chains[this.chainId]['native_symbol_price'] || 1
		},
		nativeSymbolName() {
			return this.chains[this.chainId]['native_symbol']
		},
		parsedRate() {
			if(!this.token1) return 1
			return (this.token1['is_stable'] || !this.toUSD) ? +this.rate : +this.rate * this.nativeSymbolPrice
		}
	},
	methods: {
		calcToken0() {
			this.token0Input = +this.token1Input / this.parsedRate
		}
	}
}
</script>
