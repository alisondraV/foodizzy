<template>
  <div>
    <v-header heading="Add Custom Item" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :is-positive="isPositive" :label="alertMessage" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <v-input
        class="mb-4"
        type="text"
        label="Product Name"
        v-model="product.name"
        @input="alertMessage = null"
      />
      <v-input
        class="mb-10"
        type="text"
        label="Category"
        v-model="product.category"
        @input="alertMessage = null"
      />
      <v-button label="Add" @click="resolveNewProduct" />
    </div>
  </div>
</template>

<script lang="ts">
import { AlertMixin } from "@/components/AlertMixin";
import { Component, Mixins } from "vue-property-decorator";
import { CurrentFamily } from "@/types";
import Firestore from "@/utils/Firestore";
import Product from "@/types/Product";
import VAlert from "@/components/VAlert.vue";
import VButton from "@/components/VButton.vue";
import VHeader from "@/components/VHeader.vue";
import VInput from "@/components/VInput.vue";

@Component({
  components: {
    VAlert,
    VButton,
    VInput,
    VHeader
  }
})
export default class CustomProduct extends Mixins(AlertMixin) {
  isPositive = false;
  location?: string;
  product: Product = { name: "" };

  mounted() {
    this.location = this.$route.query.location as string;
  }

  async resolveNewProduct() {
    if (!this.product) {
      return;
    }

    if (await this.isInStorageOrShoppingList()) {
      this.isPositive = false;
      return await this.showAlert(
        `${this.product.name} already exists in the ${this.location}`
      );
    }

    await this.addProductToStorageOrShoppingList();
  }

  async addProductToStorageOrShoppingList() {
    if (this.location === "storage") {
      await Firestore.instance.addProductToStorage(this.product);
    } else if (this.location === "shoppingList") {
      await Firestore.instance.addToShoppingList(this.product);
    }

    this.isPositive = true;
    await this.showAlert(
      `${this.product.name} was added to the ${this.location}`
    );
    this.product = { name: "" };
  }

  async isInStorageOrShoppingList() {
    // TODO: move to Firestore?
    const family = await CurrentFamily.instance.getCurrentFamily();

    const storageProductNames = family.storage.map(p => p.name);
    const shoppingListProductNames = family.shoppingList.map(p => p.name);
    return (
      storageProductNames?.includes(this.product.name) ||
      shoppingListProductNames?.includes(this.product.name)
    );
  }
}
</script>
