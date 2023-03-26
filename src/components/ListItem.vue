<template>
  <div class="flex justify-between items-center py-2 text-xl left-0">
    <div @click="toggleProduct">
      <img v-if="product.selected" alt="Selected" :src="getSource('selected')" />
      <img v-else alt="NotSelected" :src="getSource('default')" />
    </div>
    <span class="flex-1 ml-4 text-primary-text">{{ product.name }}</span>
    <img
      alt="EditProduct"
      v-if="currentPage !== 'newProduct'"
      src="@/assets/images/Edit.svg"
      @click="openProductEditModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Inject, InjectReactive, Prop, Vue } from 'vue-property-decorator';
import { Product } from '@/types';
import { pages } from '@/utils/consts';

@Component
export default class ListItem extends Vue {
  @Prop() product!: Product;
  @Inject('currentPage') currentPage!: string;
  @InjectReactive('editProductModal') editProductModal?: boolean;

  getSource(state): string {
    return pages[this.currentPage][state];
  }

  toggleProduct() {
    this.product.selected = !this.product.selected;
  }

  openProductEditModal() {
    this.editProductModal = true;
    console.log(this.editProductModal);
  }
}
</script>
