<template>
  <div>
    <label class="flex flex-col relative block text-gray-600">
      <span
        class="text-sm pointer-events-none tracking-wider absolute top-1/2 -translate-t-50 transition-all truncate"
        :class="{
          'bg-white top-input bg-white text-gray-700 px-2 round-sm text-xs transform-origin-left-center': isFocused
        }"
      >
        {{ label }}
      </span>

      <input
        class="border rounded-md text-gray-800 h-10"
        :value="value"
        @focus="focused = true"
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
