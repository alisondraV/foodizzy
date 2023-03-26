<template>
  <div>
    <v-header heading="Add New Item" />
    <div class="mt-20 mb-24 mx-8">
      <products-list :location="location" :products="products" />
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button
        class="mx-8 mt-3"
        data-cy="confirm-add-product"
        label="Add Items To The List"
        @click="addItemsToTheList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
import { CurrentFamily, Product } from '@/types';
import { ListItem, ProductsList, SearchInput, VButton, VHeader } from '@/components';
import Firestore from '@/utils/Firestore';
import { ListName } from '@/utils/enums';
import router from '@/router';

@Component({
  components: {
    ListItem,
    ProductsList,
    SearchInput,
    VButton,
    VHeader
  }
})
export default class NewProduct extends Vue {
  @Provide('currentPage') currentPage = 'newProduct';
  location?: string = '';
  products: Product[] = [];
  searchQuery = '';

  async mounted() {
    this.location = this.$route.query.location as string;
    this.products = await this.getProductsWithCategory();
  }

  async addItemsToTheList() {
    const selectedProducts = this.products.filter(p => p.selected);

    await Firestore.instance.addToList(selectedProducts, this.location as ListName);

    router.back();
  }
  async getProductsWithCategory() {
    const allProducts = await this.getProductsForLocation();

    return allProducts.map(product => {
      return new Product(product.name, product.category);
    });
  }

  async getProductsForLocation(): Promise<Product[]> {
    const allProducts = await CurrentFamily.instance.getAllProducts();
    const availableProducts: Product[] = [];

    for (const product of allProducts) {
      if (await this.isAvailableForTheCurrentPage(product)) {
        availableProducts.push(product);
      }
    }

    return availableProducts;
  }

  private async isAvailableForTheCurrentPage(product: Product) {
    const isInStorage = await Firestore.instance.isProductInStorage(product);
    const isInShoppingList = await Firestore.instance.isProductInShoppingList(product);

    return (
      (this.location === ListName.Storage && !isInStorage) ||
      (this.location === ListName.ShoppingList && !isInShoppingList)
    );
  }
}
</script>
