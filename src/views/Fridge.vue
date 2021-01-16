<template>
  <div>
    <h1>What is in your fridge?</h1>
    <br>
    <input v-model="searchQuery" type="search">
    <ul>
      <li v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
        <h2>{{ category }}</h2>
        <hr>
        <ul>
          <li v-for="product in filteredCategoryProducts[category]" :key="product.name">
            <input type="button" value="finished" @click="markAsFinished(product)">
            {{ product.name }}
            <input type="button" value="wasted" @click="markAsWasted(product)">
          </li>
        </ul>
      </li>
    </ul>
    <form action="">
      <label for="name">Name</label>
      <input type="text" name="name" id="name" v-model="newProductName">
      <br>
      <label for="category">Category</label>
      <input type="text" name="category" id="category" v-model="newProductCategory">
      <br>
      <input type="button" value="+" @click="addToStorage(name, category)">
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import router from "@/router";
import Authentication from "@/utils/Authentication";
import firebase from "firebase";
import IProduct from "@/types/Product";
import IFamily from "@/types/Family";

@Component
export default class Fridge extends Vue {
  products: IProduct[] = [];
  user: firebase.User | null = null;
  family: IFamily | null = null;
  searchQuery = '';
  newProductName= '';
  newProductCategory= '';

  async mounted() {
    this.user = await Authentication.getCurrentUser()
    console.log(this.user!.uid);
    
    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!")
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    this.products = this.family.storage
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    })

    type ICategory = {[category: string]: IProduct[]}
    return reducedProducts.reduce<ICategory>((acc, product) => {
      if (!Object.keys(acc).includes(product.category)) {
        acc[product.category] = [];
      }

      acc[product.category].push(product);

      return acc;
    }, {});
  }

  async markAsFinished(product: IProduct) {
    this.products = this.products.filter(p => p.name != product.name)
    await Firestore.instance.removeFromStorage(this.family, product);
    await Firestore.instance.addToShoppingList(this.family, product);
  }

  async markAsWasted(product: IProduct) {
    this.products = this.products.filter(p => p.name != product.name)
    await Firestore.instance.removeFromStorage(this.family, product);
    await Firestore.instance.addToShoppingList(this.family, product);
  }

  async addToStorage() {
    await Firestore.instance.addProductToStorage(this.family, {name: this.newProductName, category: this.newProductCategory});
  }
}
</script>
