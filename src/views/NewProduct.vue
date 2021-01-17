<template>
  <div>
    <span
      class="ml-2 w-4/5 text-2xl place-self-center font-extrabold text-primary-text"
    >
      Add new Item
    </span>
    <p v-for="product in allProducts" :key="product.name">
      <button @click="resolveNewProduct(product)">+</button>{{ product.name }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Firestore from "@/utils/Firestore";
import Authentication from "@/utils/Authentication";
import WastedProduct from "@/types/WastedProduct";
import Family from "@/types/Family";
import firebase from 'firebase';
import Product from "@/types/Product";
import router from "@/router";

@Component({
  components: {
    NavigationMenu
  }
})
export default class Home extends Vue {
  location?: string;
  allProducts: Product[] = [];
  family: Family | null = null;
  user: firebase.User | null = null;
  wastedProducts: WastedProduct[] = [];

  async mounted() {
    this.user = await Authentication.getCurrentUser();
    console.log(this.user!.uid);

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    this.allProducts = await Firestore.instance.getAllProducts();

    this.location = this.$route.query.location as string;
  }

  async resolveNewProduct(product: Product) {
    if (this.location === 'storage') {
      await Firestore.instance.addProductToStorage(this.family, product);
    } else if (this.location === 'shoppingList') {
      await Firestore.instance.addToShoppingList(this.family, product);
    }
    router.back()
  }
}
</script>