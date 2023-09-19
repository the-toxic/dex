<template>
	<v-card rounded>
		<v-card-text>
			<v-text-field v-model="fromInput" variant="outlined" hide-details density="comfortable">
				<template v-slot:append-inner><span class="fs14">{{ token }}</span></template>
			</v-text-field>
			<div class="text-center my-3">
				<v-icon icon="mdi-swap-vertical" size="large"/>
			</div>
			<v-text-field v-model="toInput" variant="outlined" hide-details density="comfortable">
				<template v-slot:append-inner>
					<v-btn-toggle v-model="toCurrency" density="compact">
						<v-btn value="usd" size="x-small" class="text-none">USD</v-btn>
						<v-btn value="token" size="x-small" class="text-none">BUSD</v-btn>
					</v-btn-toggle>
				</template>
			</v-text-field>
		</v-card-text>
	</v-card>
</template>
<script>
export default {
	name: 'Converter',
	props: {
		token: String
	},
	data() { return {
		fromInput: 10000,
		toInput: 19.11,
		toCurrency: 'usd'
	}}
}
</script>
