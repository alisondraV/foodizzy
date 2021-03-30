<template>
  <div class="flex justify-between items-center py-3 text-xl left-0">
    <div>
      <img
        v-if="product.acquired"
        alt="Acquired"
        :src="getSource('acquired')"
        @click="$emit('update', product)"
      />
      <img v-else alt="NotAcquired" :src="getSource('default')" @click="$emit('update', product)" />
    </div>
    <span class="flex-1 ml-4 text-primary-text">{{ product.name }}</span>
    <img v-if="showCross" src="@/assets/images/Close.svg" alt="Wasted" @click="$emit('remove', product)" />
  </div>
</template>

<script lang="ts">
import { pages } from '@/utils/consts';
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import Product from '@/types/Product';

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
}
</script>
