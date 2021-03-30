<template>
  <div>
    <v-header heading="Shopping List" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <products-list
        current-page="ShoppingList"
        :products="products"
        @remove="removeFromShoppingList"
        @update="checkShoppingItem"
      />
      <div v-if="!productsAreSelected" class="fixed bottom-0 w-full flex justify-center mb-20 -mx-8">
        <img @click="addNewProduct" src="@/assets/images/AddNew.svg" alt="Add" class="p-4" />
      </div>
    </div>
    <div v-if="productsAreSelected" class="h-40 bottom-0 w-full fixed flex justify-end pr-4 pt-2">
      <v-button label="Update Fridge" @click="updateFridge" />
    </div>
    <navigation-menu current-page="ShoppingList" />
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { Component, Mixins, Provide } from 'vue-property-decorator';
import { ListenerMixin, AlertMixin } from '@/mixins';
import Firestore from '@/utils/Firestore';
import ListItem from '@/components/ListItem.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import { Product } from '@/types/Product';
import ProductsList from '@/components/ProductsList.vue';
import SearchInput from '@/components/SearchInput.vue';
import VAlert from '@/components/VAlert.vue';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';
import { ProductDTO } from '@/types/DTOs';

@Component({
  components: {
    ListItem,
    NavigationMenu,
    ProductsList,
    SearchInput,
    VAlert,
    VButton,
    VHeader
  }
})
export default class ShoppingList extends Mixins(AlertMixin, ListenerMixin) {
  @Provide('currentPage') currentPage = 'ShoppingList';
  products: Product[] = [];
  searchQuery = '';
  unsubFamilyListener: (() => void) | undefined;

  async mounted() {
    this.onFamilyUpdate = family => {
      this.products = this.getProductsWithCategory(family.shoppingList);
    };
  }

  addNewProduct() {
    router.safePush({ path: 'new-product', query: { location: 'shoppingList' } });
  }

  async removeFromShoppingList(product: Product) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromShoppingList(product);
  }

  getProductsWithCategory(products: ProductDTO[]): Product[] {
    if (!products) {
      return [];
    }

    return products.map(product => {
      return new Product(product.name, product.category);
    });
  }

  async checkShoppingItem(shoppingItem: Product) {
    shoppingItem.selected = !shoppingItem.selected;
  }

  async updateFridge() {
    const selectedProducts = this.products.filter(p => p.selected);
    for (const product of selectedProducts) {
      await this.removeFromShoppingList(product);
      await Firestore.instance.addProductToStorage(product);
    }

    await this.showAlert('Products were added to the fridge');
  }

  get productsAreSelected(): boolean {
    const unselectedProducts = this.products.filter(p => !p.selected);
    return this.products.length !== unselectedProducts.length;
  }
}
</script>
