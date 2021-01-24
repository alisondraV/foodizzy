<template>
  <div>
    <v-header heading="Shopping List" />
    <div class="mt-24 mb-20 mx-8">
      <search-input class="mb-6" v-model="searchQuery" />
      <v-button class="mb-4" @click="updateFridge" label="Update Fridge" />
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
            current-page="ShoppingList"
            :key="product.name"
            :product="product"
            @remove="removeFromShoppingList"
            @update="checkShoppingItem"
          />
        </div>
      </div>
      <div class="bottom-0 right-0 mb-20 mr-3 fixed">
        <img
          @click="addNewProduct"
          src="@/assets/images/AddNew.svg"
          alt="Add"
          class="cursor-pointer p-4"
        />
      </div>
    </div>
    <navigation-menu current-page="ShoppingList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Authentication from "@/utils/Authentication";
import Family from "@/types/Family";
import ShoppingListItem from "@/types/ShoppingListItem";
import VHeader from "@/components/VHeader.vue";
import router from "@/router";
import firebase from "firebase";
import SearchInput from "@/components/SearchInput.vue";
import VButton from "@/components/VButton.vue";
import ListItem from "@/components/ListItem.vue";

@Component({
  components: {
    ListItem,
    VButton,
    SearchInput,
    NavigationMenu,
    VHeader,
  },
})
export default class ShoppingList extends Vue {
  products: ShoppingListItem[] = [];
  user: firebase.User | null = null;
  family: Family | null = null;
  searchQuery = "";

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    console.log(this.user!.uid);

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    this.products = this.getProductsWithCategory();
  }

  addNewProduct() {
    router.push({ path: "new-product", query: { location: "shoppingList" } });
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter((product) => {
      return product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: ShoppingListItem[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category ?? "General";
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);

      return acc;
    }, {});
  }

  async removeFromShoppingList(product: ShoppingListItem) {
    this.products = this.products.filter((p) => p.name != product.name);
    await Firestore.instance.removeFromShoppingList(this.family, product);
  }

  getProductsWithCategory(): ShoppingListItem[] {
    const allProducts = this.family?.shoppingList;
    if (!allProducts) {
      return [];
    }

    return allProducts!.map((product) => {
      const productCategory = product.category ?? "General";
      return {
        name: product.name,
        category: productCategory,
        acquired: product.acquired,
      };
    });
  }

  async checkShoppingItem(shoppingItem: ShoppingListItem) {
    this.products = this.products.map((product) => {
      return product.name == shoppingItem.name
        ? { ...product, acquired: !product.acquired }
        : product;
    });
    await Firestore.instance.updateShoppingList(this.family, this.products);
  }

  async updateFridge() {
    const acquiredProducts = this.products.filter((p) => p.acquired);
    for (const product of acquiredProducts) {
      await this.removeFromShoppingList(product);
      await Firestore.instance.addProductToStorage(this.family, product);
    }
  }
}
</script>
