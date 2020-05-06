<template>
	<div class="checkbox__container">
		<div class="checkbox">
			<div :class="`checkbox__check flex-c-c ${checked}`" tabindex="0" @click.stop="check" v-on:keyup.enter="check">
				<i class="icon --check" v-show="checked"></i>
			</div>
		</div>
		<slot name="label"></slot>
	</div>
</template>

<script>
export default {
	name: 'checkbox',
	data() {
		return {
			checked: ''
		};
	},
	components: {},
	methods: {
		check() {
			this.checked = this.checked ? '' : 'is-checked';
		}
	}
};
</script>

<style lang="scss">
@import './Checkbox.scss';
</style>
