<template>
  <div
    class="flex w-full text-primary-text text-lg font-bold h-14 p-3 pl-6"
    data-cy="alert"
    :class="`bg-${color}`"
  >
    {{ label }}
    <img class="ml-3" v-if="wasted" src="@/assets/images/SadFace.svg" alt="Wasted" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AlertStatus } from '@/utils/enums';
import { alertColor } from '@/utils/consts';

@Component
export default class VAlert extends Vue {
  @Prop() label!: string;
  @Prop() status!: AlertStatus;
  @Prop({ default: false }) wasted?: boolean;

  get color() {
    return alertColor[this.status];
  }
}
</script>
