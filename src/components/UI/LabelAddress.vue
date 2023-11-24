<template>
	<router-link v-if="entityLink" :to="entityLink" class="underlineHover text-disabled" target="_blank" >
		<img :src="entityIcon" class="addressIcon" onerror="this.onerror=null;this.style.display = 'none'">
		<span class="text-disabled">{{ entityName }}</span>
	</router-link>
	<span v-if="entityLink" class="text-disabled">: </span>
	<router-link v-if="typeof to === 'object' && type === 'link'" :to="to" :target="target" class="underlineHover" v-bind="$attrs" style="color:#2e7ebe;">{{ title }}</router-link>
	<a v-if="typeof to === 'string' && type === 'link'" :href="to" :target="target" class="underlineHover" v-bind="$attrs" style="color:#2e7ebe;">{{ title }}</a>
	<v-btn v-if="copy" icon="mdi-content-copy" variant="text" size="x-small" @click="$clipboard(typeof address === 'object' ? address.address : address)" />
</template>

<script>
import { API_DOMAIN, shortAddress } from "@/helpers/mixins";

export default {
  name: "LabelAddress",
	props: {
		link: { type: Boolean, default: false },
		btn: { type: Boolean, default: false },
		copy: { type: Boolean, default: false },
		text: {
			type: String,
			default: ''
		},
		address: {
			type: [String, Object],
			default: ''
		},
		to: {
			type: [String, Object],
			required: true
		},
		target: {
			type: String,
			default: '_self'
		}
	},
  data: () => ({
		API_DOMAIN,
		entityName: '',
		entityLink: '',
		entityIcon: '',
	}),
	created() {
		if(typeof this.address === 'object' && this.address.entity.uuid && this.address.entity.name) {
			this.entityName = this.address.entity.name.slice(0, 20)
			this.entityLink =  {name: 'Entity', params: {id: this.address.entity.uuid}}
			const uuid = this.address.entity.uuid
			this.entityIcon = API_DOMAIN + `/images/entities/${uuid.slice(0,1)}/${uuid}.png`
		}
	},
	methods: {
		shortAddress
	},
	computed: {
		type() {
			return this.link ? 'link' : (this.btn ? 'btn' : 'other')
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
		vertical-align: middle;
		margin-right: 8px;
	}
	.underlineHover {
		text-decoration: none;
		&:hover { text-decoration: underline }
	}
</style>
