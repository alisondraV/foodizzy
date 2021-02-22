<template>
  <div class="mt-12 mb-12 mx-8">
    <h1 class="mb-4 w-4/5 text-header font-extrabold text-primary-text">
      What is in your fridge?
    </h1>
    <search-input class="mb-4" v-model="searchQuery" />
    <div
      class="mb-4"
      v-for="category in Object.keys(filteredCategoryProducts)"
      :key="category"
    >
      <h2 class="text-primary-text text-lg mb-1">{{ category }}</h2>
      <div class="flex flex-wrap -mx-2">
        <div
          class="rounded py-2 px-3 mx-2 my-1"
          :class="
            isInProductsList(product) ? 'bg-light-yellow' : 'bg-light-grey'
          "
          style="width: 45%"
          v-for="product in filteredCategoryProducts[category]"
          :key="product.name"
          :product="product"
          @click="addToProductList(product)"
        >
          {{ product.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import Product from "@/types/Product";
import SearchInput from "@/components/SearchInput.vue";

@Component({
  components: {
    SearchInput
  }
})
export default class Fridge extends Vue {
  products: Product[] = [];
  productsToAdd: Product[] = [];
  searchQuery = "";

  async mounted() {
    this.products = await this.getProductsWithCategory();
  }

  async getProductsWithCategory() {
    const allProducts = await Firestore.instance.getAllProducts();
    return allProducts.map(product => {
      const productCategory = product.category ?? "General";
      return { name: product.name, category: productCategory };
    });
  }

  addToProductList(product: Product) {
    if (this.productsToAdd.includes(product)) {
      return (this.productsToAdd = this.productsToAdd.filter(
        prevProduct => prevProduct != product
      ));
    }
    this.productsToAdd.push(product);
  }

  isInProductsList(product: Product) {
    return this.productsToAdd.includes(product);
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category ?? "General";
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);

      return acc;
    }, {});
  }
}
</script>
