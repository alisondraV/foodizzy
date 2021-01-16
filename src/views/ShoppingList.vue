<template>
  <div>
    <h1>Shopping List</h1>
    <h2 v-for="product in products" :key="product.id">{{ product }}</h2>
    <button @click="getProducts">Get products</button>
    <div class="bottom-0 right-0 mb-20 mr-3 fixed">
      <img
        @click="addNewProduct"
        src="@/assets/images/AddNew.svg"
        alt="Add"
        class="cursor-pointer p-4"
      />
    </div>
    <navigation-menu />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import NavigationMenu from "@/components/NavigationMenu.vue";

@Component({
  components: {
    NavigationMenu
  }
})
export default class ShoppingList extends Vue {
  products: Array<string> = [];

  addNewProduct() {
    console.log("Add new");
  }

  async getProducts() {
    this.products = await Firestore.instance.getProducts();
  }
}
</script>
