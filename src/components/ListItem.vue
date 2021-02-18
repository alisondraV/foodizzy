<template>
  <div class="flex justify-between items-center py-3 text-xl left-0">
    <div v-if="isShoppingListPage()">
      <img
        v-if="product.acquired"
        src="@/assets/images/Check.svg"
        alt="Acquired"
        @click="$emit('update', product)"
      />
      <img
        v-else
        src="@/assets/images/Empty.svg"
        alt="Acquired"
        @click="$emit('update', product)"
      />
    </div>
    <div v-if="isNewProductPage()">
      <img
        v-if="inAnyLists"
        src="@/assets/images/Minus.svg"
        alt="Remove"
        @click="$emit('remove', product)"
      />
      <img
        v-else
        src="@/assets/images/Plus.svg"
        alt="Add"
        @click="$emit('add', product)"
      />
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
import { Component, Prop, Vue } from "vue-property-decorator";
import ShoppingListItem from "@/types/ShoppingListItem";
import { CurrentFamily } from "@/types";

@Component
export default class ListItem extends Vue {
  @Prop() product!: ShoppingListItem;
  @Prop() currentPage!: string;
  inAnyLists = false;

  async mounted() {
    this.inAnyLists = await this.isInStorageOrShoppingList();
  }

  isShoppingListPage() {
    return this.currentPage == "ShoppingList";
  }

  isNewProductPage() {
    return this.currentPage == "NewProduct";
  }

  async isInStorageOrShoppingList() {
    const family = await CurrentFamily.instance.getCurrentFamily();

    const storageProductNames = family.storage.map(p => p.name);
    const shoppingListProductNames = family.shoppingList.map(p => p.name);
    return (
      storageProductNames?.includes(this.product.name) ||
      shoppingListProductNames?.includes(this.product.name)
    );
  }
}
</script>
