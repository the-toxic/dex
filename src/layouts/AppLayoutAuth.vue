<script setup>
</script>

<template>
	<v-container class="d-flex align-center justify-center" style="height: 100vh">
		<v-card class="w-100" style="max-width: 600px">
			<v-card-text class="text-center">
				<slot></slot>
			</v-card-text>
		</v-card>
	</v-container>
</template>
