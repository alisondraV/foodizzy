<template>
  <div>
    <v-header heading="Add New Item" />
    <div class="mt-24 mb-20 mx-8">
      <search-input class="mb-4" v-model="searchQuery" />
      <div
        class="mb-4"
        v-for="category in Object.keys(filteredCategoryProducts)"
        :key="category"
      >
        <h2 class="text-primary-green mb-1">{{ category }}</h2>
        <hr class="text-secondary-text mb-2" />
        <div>
          <list-item
            v-for="product in filteredCategoryProducts[category]"
            current-page="NewProduct"
            :in-storage-or-shopping="isInStorageOrShoppingList(product)"
            :key="product.name"
            :product="product"
            @remove="removeExistingProduct"
            @add="resolveNewProduct"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import Authentication from "@/utils/Authentication";
import Family from "@/types/Family";
import firebase from "firebase";
import Product from "@/types/Product";
import router from "@/router";
import VHeader from "@/components/VHeader.vue";
import SearchInput from "@/components/SearchInput.vue";
import ListItem from "@/components/ListItem.vue";

@Component({
  components: {
    ListItem,
    SearchInput,
    VHeader
  }
})
export default class NewProduct extends Vue {
  location?: string;
  products: Product[] = [];
  family: Family | null = null;
  user: firebase.User | null = null;
  searchQuery = "";

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    console.log(this.user!.uid);

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    this.products = await this.getProductsWithCategory();

    this.location = this.$route.query.location as string;
  }

  async removeExistingProduct(product: Product) {
    if (this.location === "storage") {
      await Firestore.instance.removeFromStorage(this.family, product);
    } else if (this.location === "shoppingList") {
      await Firestore.instance.removeFromShoppingList(this.family, product);
    }
  }

  async resolveNewProduct(product: Product) {
    if (this.location === "storage") {
      await Firestore.instance.addProductToStorage(this.family, product);
    } else if (this.location === "shoppingList") {
      await Firestore.instance.addToShoppingList(this.family, product);
    }
    router.back();
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

  async getProductsWithCategory() {
    const allProducts = await Firestore.instance.getAllProducts();
    return allProducts.map(product => {
      const productCategory = product.category ?? "General";
      return { name: product.name, category: productCategory };
    });
  }

  isInStorageOrShoppingList(product: Product) {
    const storageProductNames = this.family?.storage.map(p => p.name);
    const shoppingListProductNames = this.family?.shoppingList.map(p => p.name);
    return (
      storageProductNames?.includes(product.name) ||
      shoppingListProductNames?.includes(product.name)
    );
  }
}
</script>
