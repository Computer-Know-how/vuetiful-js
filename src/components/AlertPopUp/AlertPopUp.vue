<template>
	<div class="popup__backdrop">
		<div class="popup__container">
			<div class="alert-popup box-shadow">
				<img class="popup__img--alert" src="https://upload.wikimedia.org/wikipedia/commons/9/99/OOjs_UI_icon_alert-yellow.svg" />
				<p class="popup__message--alert">{{ alertMessage }}</p>
				<button class="btn popup__btn--alert" @click="topBtn">{{ topButton }}</button>
				<button class="btn popup__btn--alert btn --secondary" @click="bottomBtn">{{ bottomButton }}</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'vuetiful-alert-popup',
	components: {},
	methods: {
		topBtn() {
			this.$emit('topBtn');
		},
		bottomBtn() {
			this.$emit('bottomBtn');
		}
	},
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
