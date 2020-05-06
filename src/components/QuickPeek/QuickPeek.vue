<template>
	<div>
		<div class="quick-peek" v-for="[index, tableRow] in Object.entries(this.quickPeekArr)" :key="index">
			<button @click="exit()" class="remove">X</button>
			<h2>{{ headingValue }}</h2>
			<h4> {{ subHeadingValue }}</h4>

			<div class="row" v-for="header in headers">
				<div class="column-left"><p>{{ header }}</p></div>
				<div class="column-right"><p>{{ data[header] }}</p></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'quick-peek',
	props: {
		data: Object,
		quickPeekArr: Array,
		headers: Array,
		headingValue: String,
		subHeadingValue: String,
	},
	methods: {
		exit() {
			this.$emit('exit');
		}
	},
	computed: {}
};
</script>

<style lang="scss" scoped>
@import './QuickPeek.scss';
</style>
