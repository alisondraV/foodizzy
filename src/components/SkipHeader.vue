<template>
  <div
    class="bg-background flex items-center justify-end h-20 text-lg px-10 w-full top-0 fixed"
  >
    <span class="text-dark-peach" @click="$emit('click')">Skip</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SkipHeader extends Vue {}
</script>
