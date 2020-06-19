<template>
	<div class="radiogroup --fade-in">
		<ul>
			<li v-for="(r, index) in this.labels" :key="(r, index)">
				<input type="radio" :name="r.name" :id="r.id" :v-model="r.model" :value="r.value" @click="(r.func)(r.value)" :checked="r.checked"/>
				<label :for="r.value">{{ r.label }}</label>
				<span class="check"></span>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		labels: Array
	},
	data () {
		return {};
	}
};
</script>

<style lang='scss' scoped>
@import './Tabs.scss';
</style>