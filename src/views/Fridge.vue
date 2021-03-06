<template>
  <div>
    <v-header heading="What's in your fridge?" />
    <div class="mt-20">
      <v-alert
        v-if="alertMessage"
        :label="alertMessage"
        :wasted="productWasWasted"
      />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <search-input class="mb-4" v-model="searchQuery" />
      <ul>
        <li
          class="mb-4"
          v-for="category in Object.keys(filteredCategoryProducts)"
          :key="category"
        >
          <h2 class="text-primary-green mb-1">{{ category }}</h2>
          <hr class="text-secondary-text mb-2" />
          <ul>
            <li
              class="flex justify-between py-3 text-xl left-0"
              v-for="product in filteredCategoryProducts[category]"
              :key="product.name"
            >
              <img
                src="@/assets/images/Check.svg"
                alt="Finished"
                @click="markAsFinished(product)"
              />
              <span class="flex-1 ml-4 text-primary-text">{{
                product.name
              }}</span>
              <img
                src="@/assets/images/Waste.svg"
                alt="Wasted"
                @click="markAsWasted(product)"
              />
            </li>
          </ul>
        </li>
      </ul>
      <div class="bottom-0 right-0 mb-20 mr-3 fixed">
        <img
          @click="addNewProduct"
          src="@/assets/images/AddNew.svg"
          alt="Add"
          class="cursor-pointer p-4"
        />
      </div>
    </div>
    <navigation-menu current-page="Fridge" />
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { Component, Vue } from "vue-property-decorator";
import { CurrentFamily } from "@/types";
import Firestore from "@/utils/Firestore";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Product from "@/types/Product";
import SearchInput from "@/components/SearchInput.vue";
import VAlert from "@/components/VAlert.vue";
import VHeader from "@/components/VHeader.vue";

@Component({
  components: {
    NavigationMenu,
    SearchInput,
    VAlert,
    VHeader
  }
})
export default class Fridge extends Vue {
  alertMessage = "";
  newProductCategory = "";
  newProductName = "";
  products: Product[] = [];
  productWasWasted = false;
  searchQuery = "";

  async mounted() {
    this.products = await this.getProductsWithCategory();
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

  async markAsFinished(product: Product) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromStorage(product);
    await Firestore.instance.addToShoppingList(product);

    this.alertMessage = `${product.name} was added to the Shopping List`;
    setTimeout(() => {
      this.alertMessage = "";
    }, 3000);
  }

  async markAsWasted(product: Product) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromStorage(product);
    await Firestore.instance.moveToWasted(product);
    await Firestore.instance.addToShoppingList(product);

    this.alertMessage = `${product.name} was wasted`;
    this.productWasWasted = true;
    setTimeout(() => {
      this.alertMessage = "";
      this.productWasWasted = false;
    }, 3000);
  }

  addNewProduct() {
    router.push({ path: "/new-product", query: { location: "storage" } });
  }

  async getProductsWithCategory(): Promise<Product[]> {
    const family = await CurrentFamily.instance.getCurrentFamily();
    const allProducts = family.storage;

    if (!allProducts) {
      return [];
    }

    return allProducts.map(product => {
      const productCategory = product.category ?? "General";
      return { name: product.name, category: productCategory };
    });
  }
}
</script>
