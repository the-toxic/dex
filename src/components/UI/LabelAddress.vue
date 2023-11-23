<template>
	<img v-if="iconSrc.length" :src="iconSrc" class="addressIcon" onerror="this.onerror=null;this.style.display = 'none'">
	<span v-if="entityName.length" class="text-disabled">{{ entityName }}: </span>
	<a v-if="type === 'link'" :href="to" :target="target" class="text-decoration-none" v-bind="$attrs" style="color:#2e7ebe;">{{ title }}</a>
</template>

<script>
import { API_DOMAIN, shortAddress } from "@/helpers/mixins";

export default {
  name: "LabelAddress",
	props: {
		link: { type: Boolean, default: false },
		btn: { type: Boolean, default: false },
		text: {
			type: String,
			default: ''
		},
		address: {
			type: [String, Object],
			default: ''
		},
		to: {
			type: String,
			required: true
		},
		target: {
			type: String,
			default: '_self'
		}
	},
  data: () => ({
		API_DOMAIN
	}),
	methods: {
		shortAddress
	},
	computed: {
		type() {
			return this.link ? 'link' : (this.btn ? 'btn' : 'other')
		},
		entityName() {
			return (typeof this.address === 'object' && this.address.entity.name) ? this.address.entity.name.slice(0, 20) : ''
		},
		iconSrc() {
			if (typeof this.address !== 'object' || !this.address.entity.uuid) return ''
			const uuid = this.address.entity.uuid
			return API_DOMAIN + `/images/entities/${uuid.slice(0,1)}/${uuid}.png`
		},
		title() {
			if(this.text.length) return this.text
			if(typeof this.address !== 'object') return shortAddress(this.address)

			const address = (this.entityName.length || this.address.local_label.label || this.address.global_label.label)
				? ' (...'+this.address.address.slice(-4)+')'
				: shortAddress(this.address.address, 8, 6)

			if(this.address.local_label.label || this.address.global_label.label) {
				return (this.address.local_label.label || this.address.global_label.label).slice(0, 20) + address
			}

			return address
		}
	}
}
</script>
<style>
	.addressIcon {
		height: 22px;
		border-radius: 50%;
		vertical-align: bottom;
		margin-right: 8px;
	}
</style>
