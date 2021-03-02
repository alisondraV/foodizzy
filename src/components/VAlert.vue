<template>
  <div
    class="flex w-full bg-light-peach text-primary-text text-lg font-bold h-14 p-3 pl-6"
  >
    {{ label }}
    <img
      class="ml-3"
      v-if="wasted"
      src="@/assets/images/SadFace.svg"
      alt="Wasted"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VInput extends Vue {
  @Prop() label!: string;
  @Prop() wasted?: boolean;
}
</script>
