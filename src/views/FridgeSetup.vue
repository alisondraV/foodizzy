<template>
  <div>
    <skip-header @click="goToTheNextPage" />
    <div class="mt-20 mb-24 mx-8">
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
        <div class="flex flex-wrap justify-between -mx-2">
          <div
            class="rounded py-2 px-3 mx-2 my-1"
            style="width: 45%"
            v-for="product in filteredCategoryProducts[category]"
            :key="product.name"
            :product="product"
            :style="getProductColor(product, category)"
            @click="addToProductList(product)"
          >
            {{ product.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="listIsNotEmpty" class="bg-background h-24 w-full bottom-0 fixed">
      <v-button class="mx-8 mt-3" label="Done" @click="addProductsToStorage" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import Product from "@/types/Product";
import SearchInput from "@/components/SearchInput.vue";
import SkipHeader from "@/components/SkipHeader.vue";
import VButton from "@/components/VButton.vue";
import router from "@/router";
import { colors } from "@/utils/consts";

@Component({
  components: {
    VButton,
    SearchInput,
    SkipHeader
  }
})
export default class Fridge extends Vue {
  products: Product[] = [];
  productsToAdd: Product[] = [];
  categoryColors: { [category: string]: string } = {};
  searchQuery = "";

  async mounted() {
    this.products = await this.getProductsWithCategory();
  }

  async addProductsToStorage() {
    for (const product of this.productsToAdd) {
      await Firestore.instance.addProductToStorage(product);
    }
    this.goToTheNextPage();
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

  getProductColor(product, category) {
    const defaultBg = "#E7E7E7";

    return {
      background: this.isInProductsList(product)
        ? this.categoryColors[category]
        : defaultBg
    };
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    let categoryCount = 0;
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category ?? "General";
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = [];

        this.categoryColors[categoryName] = colors[categoryCount];
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
    router.push("/");
  }
}
</script>
