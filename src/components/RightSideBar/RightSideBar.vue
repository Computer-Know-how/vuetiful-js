<template>
	<div class="right-sidebar">
	</div>
</template>

<script>
export default {
	name: 'vuetiful-right-side-bar',
	props: {},
	methods: {
		redirect(location, activeSlug) {

			this.$router.push(activeSlug);
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
@import './RightSideBar.scss';
</style>
