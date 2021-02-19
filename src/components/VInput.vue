<template>
  <div>
    <label class="flex flex-col relative block text-secondary-text">
      <input
        class="focus:outline-none border border-secondary-text
                rounded-md text-primary-text h-10 p-4"
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
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VInput extends Vue {
  @Prop() value!: null;
  @Prop() label!: string;
  @Prop() type!: string;
  focused = false;

  get isFocused() {
    return this.focused;
  }
}
</script>
