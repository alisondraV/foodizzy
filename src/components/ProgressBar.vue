<template>
  <div class="w-full">
    <div class="mb-2 text-primary-text text-center">{{ label }}</div>
    <div class="overflow-hidden h-4 mb-4 text-xs flex rounded-lg bg-light-grey">
      <div :style="`width: ${percentage}%`" class="m-progress rounded-lg bg-primary-yellow" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop() label!: number;
  @Prop() percentage!: number;
}
</script>
