<template>
  <div>
    <button
      @click="$emit('click')"
      class="text-black rounded-md bg-primary-yellow h-12 w-full"
    >
      {{ label }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VButton extends Vue {
  @Prop() label: string;
}
</script>
