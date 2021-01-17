<template>
  <div>
    <v-header heading="What's in your fridge?" />
    <div class="mt-20 mb-20 mx-8">
      <search-input class="mb-4" v-model="searchQuery" type="search" />
      <ul>
        <li
          class="mb-4"
          v-for="category in Object.keys(filteredCategoryProducts)"
          :key="category"
        >
          <h2 class="text-primary-green">{{ category }}</h2>
          <hr class="text-secondary-text" />
          <ul>
            <li
              class="flex justify-between py-3 text-xl left-0"
              v-for="product in filteredCategoryProducts[category]"
              :key="product.name"
            >
              <img
                src="@/assets/images/Finish.svg"
                alt="Finished"
                @click="markAsFinished(product)"
              />
              <span class="flex-1 ml-4">{{ product.name }}</span>
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
    <navigation-menu />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import Authentication from "@/utils/Authentication";
import firebase from "firebase";
import Product from "@/types/Product";
import Family from "@/types/Family";
import NavigationMenu from "@/components/NavigationMenu.vue";
import VHeader from "@/components/VHeader.vue";
import SearchInput from "@/components/SearchInput.vue";

@Component({
  components: {
    SearchInput,
    NavigationMenu,
    VHeader
  }
})
export default class Fridge extends Vue {
  products: Product[] = [];
  user: firebase.User | null = null;
  family: Family | null = null;
  searchQuery = "";
  newProductName = "";
  newProductCategory = "";

  async mounted() {
    this.user = await Authentication.getCurrentUser();
    console.log(this.user!.uid);

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    this.products = this.getProductsWithCategory();
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      if (!Object.keys(acc).includes(product.category)) {
        acc[product.category] = [];
      }

      acc[product.category].push(product);

      return acc;
    }, {});
  }

  async markAsFinished(product: Product) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromStorage(this.family, product);
    await Firestore.instance.addToShoppingList(this.family, product);
  }

  async markAsWasted(product: Product) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromStorage(this.family, product);
    await Firestore.instance.moveToWasted(this.family, product);
    await Firestore.instance.addToShoppingList(this.family, product);
  }

  addNewProduct() {
    console.log("Add new");
  }

  getProductsWithCategory() {
    const allProducts = this.family?.storage;
    return allProducts?.map(product => {
      const productCategory = product.category ?? "General";
      console.log(productCategory);
      return { name: product.name, category: productCategory };
    });
  }
}
</script>
