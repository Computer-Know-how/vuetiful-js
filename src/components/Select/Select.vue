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
				@change="handleSelect"
				ref="select"
			>
				<option
					v-for="item in items"
					v-bind:key="itemsKey ? item[itemsKey] : item"
					:value="itemsKey ? item[itemsKey] : item">{{ itemsKey ? item[itemsKey] : item }}
				</option>
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
	mounted() {
		this.$emit('select', this.itemsKey ? this.items[0][this.itemsKey] : this.items[0]);
	},
	props: {
		items                    : Array,
		itemsKey                 : { type: String },
		selectColor              : { type: String, default: '#606266' },
		selectBackground         : { type: String, default: '#FFFFFF' },
		selectBorderColor        : { type: String, default: '#DCDFE6' },
		selectBorderColorHovering: { type: String, default: '#C0C4CC' },
		selectBorderColorFocused : { type: String, default: '#409EFF' },
	},
	computed: {
		borderColor () {
			return (this.focused)
				? this.selectBorderColorFocused
				: this.hovering ? this.selectBorderColorHovering : this.selectBorderColor;
		}
	},
	methods: {
		handleSelect (e) { this.$emit('select', e.target.selectedOptions[0].value); },
		focus        () { this.$refs.select.focus(); },
		blur         () { this.$refs.select.blur(); },
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
@import './Select.scss';
</style>
