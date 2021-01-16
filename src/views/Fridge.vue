<template>
  <div>
    <h1>Fridge</h1>
    <h2 v-for="product in products" :key="product.id">{{ product }}</h2>
    <button @click="getProducts">GET</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";

@Component
export default class Fridge extends Vue {
  products: Array<string> = [];

  async getProducts() {
    this.products = await Firestore.instance.getProducts();
  }
}
</script>