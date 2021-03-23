<template>
  <div class="flex justify-between items-center py-3 text-xl left-0">
    <div v-if="isShoppingListPage()">
      <img
        v-if="product.acquired"
        src="@/assets/images/Check.svg"
        alt="Acquired"
        @click="$emit('update', product)"
      />
      <img v-else src="@/assets/images/Empty.svg" alt="Acquired" @click="$emit('update', product)" />
    </div>
    <div v-if="isNewProductPage()">
      <img v-if="inList" src="@/assets/images/Minus.svg" alt="Remove" @click="$emit('remove', product)" />
      <img v-else src="@/assets/images/Plus.svg" alt="Add" @click="$emit('add', product)" />
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CurrentFamily, Family } from '@/types';
import ShoppingListItem from '@/types/ShoppingListItem';

@Component
export default class ListItem extends Vue {
  @Prop() product!: ShoppingListItem;
  @Prop() currentPage!: string;
  family: Family | null = null;
  inList = false;

  async mounted() {
    const location = this.$route.query.location as string;

    this.family = await CurrentFamily.instance.getCurrentFamily();
    this.inList = location === 'storage' ? this.isInStorage() : this.isInShoppingList();
  }

  isShoppingListPage() {
    return this.currentPage == 'ShoppingList';
  }

  isNewProductPage() {
    return this.currentPage == 'NewProduct';
  }

  isInStorage() {
    const storageProductNames = this.family!.storage.map(p => p.name);
    return storageProductNames?.includes(this.product.name);
  }

  isInShoppingList() {
    const shoppingListProductNames = this.family!.shoppingList.map(p => p.name);
    return shoppingListProductNames?.includes(this.product.name);
  }
}
</script>
