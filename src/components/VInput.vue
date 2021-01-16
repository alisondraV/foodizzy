<template>
  <div>
    <label class="flex flex-col relative block text-gray-600">
      <span
        class="origin-top top-input text-sm tracking-wider absolute transition-all truncate"
        :class="{
          'bg-white top-input text-gray-700 px-2 round-sm text-xs': isFocused
        }"
      >
        {{ label }}
      </span>

      <input
        class="border rounded-md text-gray-800 h-10"
        :value="value"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('input', $event.target.value)"
        :name="label"
        :type="type"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VInput extends Vue {
  @Prop() value: null;
  @Prop() label: string;
  @Prop() errors: string;
  @Prop() type: string;
  focused = false;

  get isFocused() {
    return this.focused;
  }
}
</script>
