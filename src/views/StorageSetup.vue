<template>
  <div>
    <skip-header @click="goToTheNextPage" />
    <div class="mt-20 mb-24 mx-8">
      <h1 class="mb-4 w-4/5 text-header font-extrabold text-primary-text">What is in your storage?</h1>
      <search-input class="mb-4" v-model="searchQuery" />
      <div class="mb-4" v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
        <h2 class="text-primary-text text-lg mb-1">{{ category }}</h2>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <div
            class="rounded py-2 px-3"
            data-cy="product"
            v-for="product in filteredCategoryProducts[category]"
            :key="product.name"
            :style="getProductColor(product, category)"
            @click="updateProductList(product)"
          >
            {{ product.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="listIsNotEmpty" class="bg-background h-24 w-full bottom-0 fixed">
      <v-button class="mx-8 mt-3" label="Done" @click="addProductsToStorage" data-cy="add-products" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
import { Product } from '@/types';
import { ListName, PathName } from '@/utils/enums';
import { SearchInput, SkipHeader, VButton } from '@/components';
import Firestore from '@/utils/Firestore';
import router from '@/router';
import API from '@/utils/API';

@Component({
  components: {
    VButton,
    SearchInput,
    SkipHeader
  }
})
export default class StorageSetup extends Vue {
  @Provide('currentPage') currentPage = 'storageSetup';
  categoryColors: { [category: string]: string } = {};
  products: Product[] = [];
  productsToAdd: Product[] = [];
  colors = ['#B6DDDA', '#FFE6A3'];
  searchQuery = '';

  async mounted() {
    this.products = await API.instance.getAllProducts();
  }

  async addProductsToStorage() {
    await Firestore.instance.addToList(this.productsToAdd, ListName.Storage);
    this.goToTheNextPage();
  }

  updateProductList(product: Product) {
    if (this.isInProductsList(product)) {
      return (this.productsToAdd = this.productsToAdd.filter(prevProduct => prevProduct != product));
    }
    this.productsToAdd.push(product);
  }

  isInProductsList(product: Product) {
    return this.productsToAdd.includes(product);
  }

  getProductColor(product, category) {
    const defaultBg = '#E7E7E7';

    return {
      background: this.isInProductsList(product) ? this.categoryColors[category] : defaultBg
    };
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    let categoryCount = 0;
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category;
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = [];

        this.categoryColors[categoryName] = this.colors[categoryCount % 2];
        categoryCount++;
      }
      acc[categoryName].push(product);

      return acc;
    }, {});
  }

  get listIsNotEmpty() {
    return this.productsToAdd.length !== 0;
  }

  goToTheNextPage() {
    router.safePush!(PathName.Storage);
  }
}
</script>
