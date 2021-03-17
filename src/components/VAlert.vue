<template>
  <div
    class="flex w-full text-primary-text text-lg font-bold h-14 p-3 pl-6"
    :class="isPositive ? 'bg-light-green' : 'bg-light-peach'"
  >
    {{ label }}
    <img class="ml-3" v-if="wasted" src="@/assets/images/SadFace.svg" alt="Wasted" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VAlert extends Vue {
  @Prop() label!: string;
  @Prop({ default: true }) isPositive?: boolean;
  @Prop({ default: false }) wasted?: boolean;
}
</script>
