<template>
  <div>
    <h1>Shopping List</h1>
    <h2 v-for="product in products" :key="product.id">{{ product }}</h2>
    <button @click="getProducts">Get products</button>
    <button @click="goBack">Back</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import router from "@/router";

@Component
export default class ShoppingList extends Vue {
  products: Array<string> = [];

  async getProducts() {
    this.products = await Firestore.instance.getProducts();
  }
  goBack() {
    router.back();
  }
}
</script>
