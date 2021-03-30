<template>
  <div>
    <img @click="$emit('click')" :src="iconSource" :alt="iconName" />
  </div>
</template>

<script lang="ts">
import { IconName, Icons } from '@/utils/consts';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VFab extends Vue {
  @Prop() iconName!: IconName;

  get iconSource() {
    return Icons[this.iconName];
  }
}
</script>
