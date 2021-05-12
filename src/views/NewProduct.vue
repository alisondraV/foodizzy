<template>
  <div>
    <v-header heading="Add New Item" />
    <div class="mt-20 mb-20 mx-8">
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
import router from '@/router';
import { Component, Provide, Vue } from 'vue-property-decorator';
import { CurrentFamily, Product } from '@/types';
import Firestore from '@/utils/Firestore';
import ListItem from '@/components/ListItem.vue';
import SearchInput from '@/components/SearchInput.vue';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';
import ProductsList from '@/components/ProductsList.vue';
import { ListName } from '@/utils/consts';

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
  @Provide('currentPage') currentPage = 'NewProduct';
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
      (this.location === 'storage' && !isInStorage) || (this.location === 'shoppingList' && !isInShoppingList)
    );
  }
}
</script>
