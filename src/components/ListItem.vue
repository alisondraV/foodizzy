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
    <img
      v-if="isShoppingListPage()"
      src="@/assets/images/Close.svg"
      alt="Wasted"
      @click="$emit('remove', product)"
    />
  </div>
</template>

<script lang="ts">
import { pages } from '@/utils/consts';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Product from '@/types/Product';

@Component
export default class ListItem extends Vue {
  @Prop() product!: Product;
  @Prop() currentPage!: string;

  isShoppingListPage() {
    return this.currentPage == 'ShoppingList';
  }

  getSource(state) {
    return pages[this.currentPage][state];
  }
}
</script>
