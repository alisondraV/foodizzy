<template>
  <div>
    <h1>Fridge</h1>
    <h2 v-for="product in products" :key="product.id">{{ product }}</h2>
    <button @click="goBack">Back</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import router from "@/router";
import Authentication from "@/utils/Authentication";
import firebase from "firebase";

@Component
export default class Fridge extends Vue {
  products: Array<string> = [];
  user: firebase.User | null = null;

  mounted() {
    console.log('mounted');
    
    // this.products = await Firestore.instance.getProducts();
    Authentication.onAuthStateChanged(user => {
      if (!user) {
        // TODO: handle unauthorized state
        throw new Error("Unauthrized!")
      }
      Firestore.instance.getFamilyForUser(user).then(family => console.log(family));

      this.user = user;
    });
    
  }
  goBack() {
    router.back();
  }
}
</script>
