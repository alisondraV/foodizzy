<template>
  <div>
    <button
      @click="$emit('click')"
      class="text-primary-text rounded-md bg-primary-yellow h-12 w-full"
      :style="disabled ? 'opacity: 50%' : 'opacity: 100%;'"
      :disabled="disabled"
    >
      {{ label }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VButton extends Vue {
  @Prop() label!: string;
  @Prop({ default: false }) disabled?: boolean;
}
</script>