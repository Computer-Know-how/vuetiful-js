<template>
	<div class="sidebar">
		<span>
		<ul>
			<li v-for="item in navigableItems"
				class="sidebar__item"
				:class="(loadedPage === item.location || item.location === '/dashboard' && loadedPage == '/') ? 'active' : ''"
				:id="`sidebar__item--${item.slug}`"
				:ref="`sidebar__item--${item.slug}`"
				v-bind:key="item.slug"
				v-show="!item.permissionLevel || userPermissionLevel >= item.permissionLevel"
				@click="redirect(item.location, item.slug)"
			>
				<span><b-icon :font-scale="1.2" v-if="item.icon" :icon="item.icon"></b-icon></span>
				<span>{{ item.label }}</span>
			</li>
		</ul>
		</span>
		<span>
			<ul>
				<li class="last-el bottom" util-class="background-primary">
					<span><b-icon :font-scale="1.5" icon="door-closed-fill"></b-icon></span>
					<span>Logout</span>
				</li>
			</ul>
		</span>
		<!-- <b-icon :font-scale="1.5" v-if="item.icon" :icon="item.icon"></b-icon> -->
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
		userPermissionLevel: Number,
		expanded: Boolean
	},
	methods: {
		redirect(location, activeSlug) {
			if(activeSlug !== this.$router.currentRoute.name) {
				this.$router.push(activeSlug);
			}
		}
	},
	computed: {
		loadedPage: function () {
			return this.$router.currentRoute.path;
		}
	},
	watch: {
		$route (to, from) {
			const fromRoute = this.$refs[`sidebar-item--${from.name}`];
			const toRoute = this.$refs[`sidebar-item--${to.name}`];
			if (fromRoute) fromRoute.classList.remove('active');
			if (toRoute) toRoute.classList.add('active');
		}
	}
};
</script>

<style scoped lang="scss">
@import './SideBar.scss';
</style>