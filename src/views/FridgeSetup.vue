<template>
  <div>
    <div class="mt-24 mb-20 mx-8">
      <span
        class="ml-4 w-4/5 text-header place-self-center font-extrabold text-primary-text"
      >
        What is in your fridge?
      </span>
      <search-input class="mb-4" v-model="searchQuery" />
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
  searchQuery = "";
  newProductName = "";
  newProductCategory = "";

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
}
</script>
