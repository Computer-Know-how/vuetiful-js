<template>
	<div class="search-form" :class="narrow ? 'narrow' : ''">
		<vuetiful-tabs class="search-form__tabs" v-show="tabs" :labels="labels"></vuetiful-tabs>
		<h2>{{ headerText }}</h2>
		<span v-if="!fieldSets">
			<div class="search-form__container">
				<div v-for="field in formFields" v-bind:key="field.label" class="search-form__field">
					<label>{{ field.label }}</label>
					<input-field v-if="field.type !== 'dropdown'" :alt="oFormFields[field.label]" v-model="oFormFields[field.label]" :type="field.type"></input-field>
					<select-field v-else :items="field.items"></select-field>
				</div>
			</div>
		</span>

		<span v-if="fieldSets">
			<div class="search-form__container">
				<fieldset v-for="label in oFieldSetsLabels" :key="label">
					<legend>{{ label }}</legend>
					<span v-for="field in formFields" :key="field.slug" class="field-set-form__field">
						<span v-if="label === field.group" >
							<label>{{ field.label }}</label>
							<input-field v-if="field.type !== 'dropdown'" :alt="oFormFields[field.slug]" v-model="oFormFields[field.slug]" @input="emitEvent('searchValueSet', oFormFields)" :type="field.type"></input-field>
							<select-field v-else @select="emitEvent('searchValueSet', oFormFields)" :items="field.items"></select-field>
						</span>
					</span>
				</fieldset>
			</div>
		</span>

		<search-checkbox @checkboxClicked="includeInactiveDocs = true" v-if="checkboxText">
			<label slot="label">{{ checkboxText }}</label>
		</search-checkbox>
		<div class="btn__container dqm-pod__block" alignment="end">
			<button right :class="button.class" class="dqm-btn" v-for="button of formButtons" :key="button.text" v-on:click="(button.func)(oFormFields)" btn-elevated> {{ button.text }} </button>
		</div>
	</div>
</template>

<script>
import Input from '../Input/Input.vue';
import Select from '../Select/Select.vue';
import Checkbox from '../Checkbox/Checkbox.vue';
import Tabs from '../Tabs/Tabs.vue';

export default {
	name: 'search-form',
	data() {
		return {
			includeInactiveDocs: false
		};
	},
	computed: {
		oFormFields: function() {
			return this.formFields.reduce((agg, cur) => { agg[cur.slug] = ''; return agg; }, {});
		},
		oFieldSetsLabels: function() {
			return this.formFields.reduce((agg, cur) => {
				if(!agg.includes(cur.group)) {
					agg.push(cur.group);
				}
				return agg;
			}, []);
		},
	},
	components: { 'input-field': Input, 'search-checkbox': Checkbox, 'select-field': Select, 'vuetiful-tabs': Tabs },
	props: {
		tabs: Boolean,
		formFields: Array,
		searchFunc: Function,
		enableCheckbox: Boolean,
		checkboxText: String,
		formButtons: Array,
		narrow: Boolean,
		fieldSets: Boolean,
		fieldSetLabels: Array,
		headerText: String,
		labels: Array
	}
};
</script>

<style lang="scss" scoped>
@import './SearchForm.scss';
</style>
