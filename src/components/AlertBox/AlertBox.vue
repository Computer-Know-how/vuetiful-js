<template>
	<div class="alert-box" role="alert">
		<button type="button" @click="handleClick()" aria-label="Close">
			<span aria-hidden="true">×</span>
		</button>
		<p>{{ errorMessage }}</p>
	</div>
</template>

<script>
export default {
	name: 'vuetiful-alert',
	components: {},
	methods: {
		handleClick() {
			this.$emit('buttonClick');
		}
	},
	props: {
		errorMessage: String
	}
};
</script>

<style scoped lang="scss">
@import './AlertBox.scss';
</style>
