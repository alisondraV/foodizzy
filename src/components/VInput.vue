<template>
  <div>
    <label class="flex flex-col relative text-secondary-text">
      <input
        class="focus:outline-none
                rounded-md text-primary-text h-10 p-4"
        :class="
          error ? 'border-2 border-dark-peach' : 'border border-secondary-text'
        "
        :value="value"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('input', $event.target.value)"
        :type="type"
        :placeholder="label"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VInput extends Vue {
  @Prop() value!: null;
  @Prop() label!: string;
  @Prop({ default: 'text' }) type?: string;
  @Prop({ default: false }) error?: boolean;
  focused = false;

  get isFocused() {
    return this.focused;
  }
}
</script>
