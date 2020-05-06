<template>
	<div class="popup__container">
		<div class="alert-popup box-shadow">
			<img class="popup__img--alert" src="https://upload.wikimedia.org/wikipedia/commons/9/99/OOjs_UI_icon_alert-yellow.svg" />
			<p class="popup__message--alert">{{ alertMessage }}</p>
			<button class="btn popup__btn--alert">{{ topButton }}</button>
			<button class="btn popup__btn--alert btn --secondary">{{ bottomButton }}</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'vuetiful-alert-popup',
	components: {},
	methods: {},
	props: {
		alertMessage: String,
		topButton: String,
		bottomButton: String
	}
};
</script>

<style scoped lang="scss">
@import './AlertPopUp.scss';
</style>
