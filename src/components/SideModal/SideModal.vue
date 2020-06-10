<template>
	<div :class="`sidebar-${position}`" class="sidebar-container">
		<slot id="content"></slot>
	</div>
</template>

<script>
export default {
	name: 'vuetiful-side-modal',
	props: {
		position: {type: String, default: 'right'}
	},
	methods: {
		redirect(location, activeSlug) {

			this.$router.push({name: activeSlug});
		}
	},
	computed: {
		loadedPage: function () {
			return this.$router.currentRoute.path;
		}
	}
};
</script>

<style scoped lang="scss">
@import './SideModal.scss';
</style>
