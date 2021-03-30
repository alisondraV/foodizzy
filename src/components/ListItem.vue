<template>
  <div class="flex justify-between items-center py-3 text-xl left-0">
    <div @click="toggleProduct">
      <img v-if="product.selected" alt="Acquired" :src="getSource('selected')" />
      <img v-else alt="NotAcquired" :src="getSource('default')" />
    </div>
    <span class="flex-1 ml-4 text-primary-text">{{ product.name }}</span>
    <img v-if="showCross" src="@/assets/images/Close.svg" alt="Wasted" @click="$emit('remove', product)" />
  </div>
</template>

<script lang="ts">
import { pages } from '@/utils/consts';
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import { Product } from '@/types';

@Component
export default class ListItem extends Vue {
  @Prop() product!: Product;
  @Inject('currentPage') currentPage!: string;

  get showCross(): boolean {
    return this.currentPage === 'ShoppingList' || this.currentPage === 'Fridge';
  }

  getSource(state): string {
    return pages[this.currentPage][state];
  }

  toggleProduct() {
    this.product.selected = !this.product.selected;
  }
}
</script>
