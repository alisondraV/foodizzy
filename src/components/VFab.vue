<template>
  <div class="pb-2">
    <img @click="$emit('click')" :src="iconSource" :alt="iconName" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IconName } from '@/utils/enums';
import { Icons } from '@/utils/consts';

@Component
export default class VFab extends Vue {
  @Prop() iconName!: IconName;

  get iconSource() {
    return Icons[this.iconName];
  }
}
</script>
