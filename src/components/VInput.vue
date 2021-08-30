<template>
  <div>
    <label class="flex flex-col text-secondary-text">
      <span class="text-left mb-1 text-sm" :class="isFocused ? 'text-primary-green' : ''">
        {{ label }}
      </span>
      <input
        class="focus:outline-none rounded-md text-primary-text h-10 p-4 placeholder-secondary-text
                focus:border-primary-green"
        :class="error ? 'border-2 border-dark-peach' : 'border border-secondary-text'"
        @input="$emit('input', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
        :placeholder="placeholder"
        :type="type"
        :value="value"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VInput extends Vue {
  @Prop() label!: string;
  @Prop() placeholder!: string;
  @Prop() value!: null;
  @Prop({ default: 'text' }) type?: string;
  @Prop({ default: false }) error?: boolean;
  focused = false;

  get isFocused() {
    return this.focused;
  }
}
</script>
