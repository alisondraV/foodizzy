<template>
  <div>
    <h1>Fridge</h1>
    <button @click="goBack">Back</button>
    <h2 v-for="product in products" :key="product">{{ product }}</h2>
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
  products: string[] = [];
  user: firebase.User | null = null;

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

  goBack() {
    router.back();
  }
}
</script>
