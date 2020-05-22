<template>
    <div class="popup__container">
        <div class="popup">
            <h4>{{ header }}</h4>
						<slot></slot>
            <p>{{ alertMessage }}</p>
            <div class="btn__container">
                <button @click="emitClick('left')" :class="`btn ${leftBtnClass || 'btn --light --gray-fill'}`" :hidden="!leftButton">{{ leftButton }}</button>
                <button @click="emitClick('right')" :class="`btn ${rightBtnClass || 'btn --primary --white-fill'}`" :hidden="!rightButton">{{ rightButton }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'vuetiful-popup',
	components: {},
	methods: {
		emitClick(side) {
			this.$emit(`${side}ButtonClick`);
		}
	},
	props: {
		header: String,
		alertMessage: String,
		leftButton: String,
		rightButton: String,
		leftBtnClass: String,
		rightBtnClass: String
	}
};
</script>

<style scoped lang="scss">
@import './PopUp.scss';
</style>