<template>
  <div>
    <v-header heading="Add Custom Item" />
    <div class="mt-24 mb-20 mx-8">
      <v-input
        class="mb-4"
        type="text"
        label="Product Name"
        v-model="product.name"
      />
      <v-input
        class="mb-10"
        type="text"
        label="Category"
        v-model="product.category"
      />
      <v-button label="Add" @click="resolveNewProduct" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import Authentication from "@/utils/Authentication";
import Family from "@/types/Family";
import firebase from "firebase";
import Product from "@/types/Product";
import router from "@/router";
import VHeader from "@/components/VHeader.vue";
import VInput from "@/components/VInput.vue";
import VButton from "@/components/VButton.vue";

@Component({
  components: {
    VButton,
    VInput,
    VHeader
  }
})
export default class CustomProduct extends Vue {
  location?: string;
  family: Family | null = null;
  user: firebase.User | null = null;
  product: Product = {};

  async mounted() {
    this.user = await Authentication.getCurrentUser();

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);

    this.location = this.$route.query.location as string;
  }

  async resolveNewProduct() {
    if (this.isInStorageOrShoppingList()) {
      console.log(this.product.name, " already exists");
      return;
    }

    if (this.location === "storage") {
      await Firestore.instance.addProductToStorage(this.family, this.product);
    } else if (this.location === "shoppingList") {
      await Firestore.instance.addToShoppingList(this.family, this.product);
    }
    router.back();
  }

  isInStorageOrShoppingList() {
    const storageProductNames = this.family?.storage.map(p => p.name);
    const shoppingListProductNames = this.family?.shoppingList.map(p => p.name);
    return (
      storageProductNames?.includes(this.product.name) ||
      shoppingListProductNames?.includes(this.product.name)
    );
  }
}
</script>
