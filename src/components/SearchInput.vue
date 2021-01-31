<template>
  <div class="border border-secondary-text rounded-md flex w-full">
    <img class="pl-4" src="@/assets/images/Search.svg" alt="Finished" />
    <input
      class="text-primary-text h-10 w-full p-4 mr-2 focus:outline-none"
      :value="value"
      @focus="focused = true"
      @blur="focused = false"
      @input="$emit('input', $event.target.value)"
      type="text"
      placeholder="What are you looking for?"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SearchInput extends Vue {
  @Prop() value!: null;
  focused = false;

  get isFocused() {
    return this.focused;
  }
}
</script>
