<template>
	<div class="sidebar">
		<ul>
			<li v-for="item in navigableItems"
				:class="(loadedPage === item.location || item.location === '/dashboard' && loadedPage == '/') ? 'active' : ''"
				:id="item.slug"
				v-bind:key="item.slug"
				v-show="!item.permissionLevel || userPermissionLevel >= item.permissionLevel"
				@click="redirect(item.location, item.slug)">
				{{ item.label }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'vuetiful-side-bar',
	props: {
		/*
			The navigableItems property should be an array of objects, with each object representing an nav item in the sidebar
			e.g. navigableItems: [
				{
					"slug": "dashboard", // The unique identifier for the sidebar item
					"label": "Dashboard", // The display text of the sidebar item
					"location": "/dashboard" // The URL the sidebar item should redirect to
					"permissionLevel": 0, // the level of permission required to view this menu item
				}
			]
		*/
		navigableItems: Array,
		/* The permission level of the current user */
		userPermissionLevel: Number
	},
	methods: {
		redirect(location, activeSlug) {
			this.navigableItems.map(inactive => {
				(inactive.slug != activeSlug)
					? document.querySelector(`#${inactive.slug}`).classList.remove('active')
					: document.querySelector(`#${activeSlug}`).classList.add('active');
			});

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
@import './SideBar.scss';
</style>
