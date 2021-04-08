<template>
  <div class="w-full">
    <div class="mb-2 text-primary-text text-sm">{{ percentage }} % of all food waste is {{ category }}.</div>
    <div class="overflow-hidden h-4 mb-4 text-xs flex rounded-lg bg-light-grey">
      <div :style="`width: ${percentage}%; background: ${color}`" class="m-progress rounded-lg" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop() category!: string;
  @Prop() color!: number;
  @Prop() percentage!: number;
}
</script>
