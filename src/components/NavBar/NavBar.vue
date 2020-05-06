<template>
    <nav
			v-if="type === 'sidebar'"
			v-on:click="toggleSideBar"
			:style="{ 'backgroundColor': color || defaultColor }"
			:class="{ 'box-shadow': shadow }"
			@mouseenter="hovering = true"
			@mouseleave="hovering = false"
		>
      <i class="icon icon --nav"></i>
	</nav>
	<nav
		v-else-if="type === 'navbar'"
		:class="{ 'box-shadow': shadow }"
		:style="{ 'backgroundColor': color || defaultColor, height: height || defaultHeight, lineHeight: height || defaultHeight  }">
		<slot></slot>
		<div
			v-for="navItem of items"
			class="navbar__item"
			:key="navItem.slug"
			:class="{ '--dropdown': true }"
			:ref="navItem.slug"
			@mouseenter="handleHover(navItem, false)"
			@mouseleave="handleHover(navItem.slug, true)"
			:style="{ height: height || defaultHeight, lineHeight: height || defaultHeight, backgroundColor: color || defaultColor, color: theme === 'light' ? 'black' : 'white' }"
		>
			<p>{{ navItem.label }} <i class="icon --down"></i></p>
			<div
				:style="{ top: height || defaultHeight }"
				:id="`${navItem.slug}`"
				class="navbar__item-dropdown-list"
				hidden
			>
				<div
					v-for="childItem of navItem.items"
					:key="childItem.slug"
					:id="childItem.slug"
					:style="{ top: height }"
					class="navbar__sub-item"
				>
					{{ childItem.label }}
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
import navbarIcon from '../../assets/icons/navbar-menu-icon.svg';
import styles from './NavBar.scss';

export default {
	name: 'vuetiful-nav-bar',
	data: function() {
		return {
			navbarIcon,
			sideBarOpen: false,
			defaultHeight: styles.navbarHeight,
			defaultColor: styles.navbarColor
		};
	},
	methods: {
		toggleSideBar() {
			this.sideBarOpen = this.sideBarOpen ? false : true;
			this.$emit('toggleSideBar', this.sideBarOpen);
		},
		handleHover(id, hide) {
			console.log(id); /* eslint-disable-line */
			document.querySelector(`#${id}`).hidden = hide;
		}
	},
	props: {
		type: String,
		color: String,
		height: String,
		shadow: Boolean,
		items: Array,
		theme: String
	}
};
</script>

<style scoped lang="scss">
@import './NavBar.scss';
</style>
