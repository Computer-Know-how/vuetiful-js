<template>
  <div class="input__container" @mouseenter="hovering = true" @mouseleave="hovering = false" :style="{ backgroundColor: inputBackground }">
    <input ref="input" :placeholder="placeholder" :type="type"
      :class="`${placeholderEffect} ${prefixIcon ? 'prefix' : ''}`"
      :style="{ color: inputColor, borderColor: borderColor }"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
			v-on:keydown="validate"
    />

    <span class="input__prefix" v-if="prefixIcon">
      <i class="icon" v-if="prefixIcon" :class="prefixIcon" />
    </span>
  </div>
</template>

<script>
export default {
	name: 'vuetiful-input',
	data () {
		return {
			hovering: false,
			focused: false,
			validate: this.$validation.validate
		};
	},
	props: {
		value: [ String, Number ],
		type: { type: String, default: 'text' },
		placeholder: { type: String, default: '' },
		placeholderEffect: { type: String, default: 'light' },
		inputColor: { type: String, default: '#606266' },
		inputBackground: { type: String, default: '#FFFFFF' },
		inputBorderColor: { type: String, default: '#DCDFE6' },
		inputBorderColorHovering: { type: String, default: '#C0C4CC' },
		inputBorderColorFocused: { type: String, default: '#409EFF' },
		prefixIcon: String,
		suffixIcon: String
	},
	computed: {
		borderColor () {
			return (this.focused)
				? this.inputBorderColorFocused
				: this.hovering ? this.inputBorderColorHovering : this.inputBorderColor;
		}
	},
	methods: {
		getInput     ()      { this.$refs && this.$refs.input ? this.$refs.input : null; },
		focus        ()      { this.$refs.input.focus(); },
		blur         ()      { this.$refs.input.blur (); },
		handleInput  (event) { this.$emit('input', event.target.value ); },
		handleChange (event) { this.$emit('change', event.target.value ); },
		handleFocus  (event) {
			this.focused = true;
			this.$emit('focus', event);
		},
		handleBlur (event) {
			this.focused = false;
			this.$emit('blur', event);
		}
	}
};
</script>

<style scoped lang="scss">
@import './Input.scss';
</style>
