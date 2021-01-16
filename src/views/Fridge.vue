<template>
  <div>
    <h1>Fridge</h1>
    <button @click="goBack">Back</button>
    <br>
    <input v-model="searchQuery" type="search">
    <ul>
      <li v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
        <h2>{{ category }}</h2>
        <ul>
          <li v-for="product in filteredCategoryProducts[category]" :key="product.name">{{ product.name }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import router from "@/router";
import Authentication from "@/utils/Authentication";
import firebase from "firebase";
import IProduct from "@/types/Product";

@Component
export default class Fridge extends Vue {
  products: IProduct[] = [];
  user: firebase.User | null = null;
  searchQuery = '';

  async mounted() {
    this.user = await Authentication.getCurrentUser()
    console.log(this.user!.uid);
    
    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!")
    }

    const family = await Firestore.instance.getFamilyForUser(this.user!);
    this.products = family.storage
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    })

    type ICategory = {[category: string]: IProduct[]}
    return reducedProducts.reduce<ICategory>((acc, product) => {
      if (!Object.keys(acc).includes(product.category)) {
        acc[product.category] = []
      }

      acc[product.category].push(product)

      return acc
    }, {})
  }

  goBack() {
    router.back();
  }
}
</script>
