<template>
	<v-img :src="src" :width="width" :height="width" :alt="alt" class="va-top rounded-xl">
		<template v-slot:error>
			<div class="d-flex align-center justify-center fill-height"><v-icon icon="mdi-help-circle" :size="errorSize" /></div>
		</template>
		<!-- <template v-slot:error><div class="bg-grey-darken-3 fill-height text-center fs14 pt-1">?</div></template>-->
		<!-- <template v-slot:placeholder><div class="d-flex align-center justify-center fill-height"><v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular></div></template>-->
	</v-img>
</template>

<script>
export default {
  name: "TokenIcon",
	props: {
		src: {
			type: String,
			required: true
		},
		width: {
			type: String,
			default: '24'
		},
		alt: {
			type: String,
			default: ''
		},
		errorSize: {
			type: String,
			default: 'x-large'
		}
	},
  data: () => ({}),
}
</script>
