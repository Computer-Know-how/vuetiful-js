<template>
	<div
		class="select__container"
		@mouseenter="hovering = true"
		@mouseleave="hovering = false"
		:style="{ color: selectColor, borderColor: borderColor, backgroundColor: selectBackground }">
			<i class="icon --down"></i>
			<select
				@focus="handleFocus"
				@blur="handleBlur"
			>
				<option v-for="item in items" v-bind:key="item" :value="item">{{ item }}</option>
			</select>
	</div>
</template>

<script>
export default {
	name: 'vuetiful-select',
	data () {
		return {
			hovering: false,
			focused: false
		};
	},
	props: {
		items: Array,
		value: [ String, Number ],
		type: { type: String, default: 'text' },
		selectColor: { type: String, default: '#606266' },
		selectBackground: { type: String, default: '#FFFFFF' },
		selectBorderColor: { type: String, default: '#DCDFE6' },
		selectBorderColorHovering: { type: String, default: '#C0C4CC' },
		selectBorderColorFocused: { type: String, default: '#409EFF' },
	},
	computed: {
		borderColor () {
			return (this.focused)
				? this.selectBorderColorFocused
				: this.hovering ? this.selectBorderColorHovering : this.selectBorderColor;
		}
	},
	methods: {
		getselect () { this.$refs && this.$refs.select ? this.$refs.select : null; },
		focus     () { this.$refs.select.focus(); },
		blur      () { this.$refs.select.blur(); },
		handleFocus  (event) {
			this.focused = true;
			this.$emit('focus', event);
		},
		handleBlur (event) {
			this.focused = false;
			this.$emit('blur', event);
		}
	}
};
</script>

<style scoped lang="scss">
@import './select.scss';
</style>
