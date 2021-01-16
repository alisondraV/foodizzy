<template>
  <div>
    <h1>Fridge</h1>
    <button @click="goBack">Back</button>
    <input v-model="searchQuery" type="search">
    <ul>
      <li v-for="product in filteredProducts" :key="product.name">{{ product.name }}</li>
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

  get filteredProducts() {
    return this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    })
  }

  goBack() {
    router.back();
  }
}
</script>
