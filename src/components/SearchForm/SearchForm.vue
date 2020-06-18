<template>
	<div class="search-form" :class="narrow ? 'narrow' : ''">
		<span v-if="!fieldSets">
			<h2>{{ headerText }}</h2>
			<div class="search-form__container">
				<div v-for="field in formFields" v-bind:key="field.label" class="search-form__field">
					<label>{{ field.label }}</label>
					<input-field v-if="field.type !== 'dropdown'" :alt="oFormFields[field.label]" v-model="oFormFields[field.label]" :type="field.type"></input-field>
					<select-field v-else :items="field.items"></select-field>
				</div>
			</div>
		</span>

		<span v-if="fieldSets">
			<h2 class="search-form_header">{{ headerText }}</h2>
			<div class="search-form__container">
				<fieldset v-for="label in oFieldSetsLabels" :key="label">
					<legend>{{ label }}</legend>
					<span v-for="field in formFields" :key="field.label" class="field-set-form__field">
						<span v-if="label === field.group" >
							<label>{{ field.label }}</label>
							<input-field v-if="field.type !== 'dropdown'" :alt="oFormFields[field.label]" v-model="oFormFields[field.label]" :type="field.type"></input-field>
							<select-field v-else :items="field.items"></select-field>
						</span>
					</span>
				</fieldset>
			</div>
		</span>

		<search-checkbox @checkboxClicked="includeInactiveDocs = true" v-if="checkboxText">
			<label slot="label">{{ checkboxText }}</label>
		</search-checkbox>
		<div class="btn__container">
			<button :class="button.class" class="btn" v-for="button of formButtons" :key="button.text" v-on:click="(button.func)(oFormFields)"> {{ button.text }} </button>
		</div>
	</div>
</template>

<script>
import Input from '../Input/Input.vue';
import Select from '../Select/Select.vue';
import Checkbox from '../Checkbox/Checkbox.vue';

export default {
	name: 'search-form',
	data() {
		return {
			includeInactiveDocs: false
		};
	},
	components: { 'input-field': Input, 'search-checkbox': Checkbox, 'select-field': Select },
	computed: {
		oFormFields() {
			return this.formFields.reduce((agg, cur) => { agg[cur.label] = ''; return agg; }, {});
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
	components: { 'input-field': Input, 'search-checkbox': Checkbox, 'select-field': Select },
	methods: {},
	props: {
		formFields: Array,
		searchFunc: Function,
		enableCheckbox: Boolean,
		checkboxText: String,
		formButtons: Array,
		narrow: Boolean,
		fieldSets: Boolean,
		fieldSetLabels: Array,
		headerText: String
	}
};
</script>

<style lang="scss">
@import './SearchForm.scss';
</style>
