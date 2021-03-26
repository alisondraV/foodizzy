<template>
  <div>
    <v-header heading="Add Custom Item" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :is-positive="false" :label="alertMessage" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <v-input
        class="mb-4"
        type="text"
        label="Product Name"
        placeholder="Enter product name"
        v-model="product.name"
        @input="alertMessage = null"
      />
      <v-select
        label="Category"
        :selection-list="categoriesList"
        :selected-item="selectedCategory"
        @change="setSelectedCategory"
      />
      <v-input
        v-if="customCategory"
        class="mb-10"
        type="text"
        label="Category"
        placeholder="Enter category"
        v-model="product.category"
        @input="alertMessage = null"
      />
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button label="Add" class="mx-8" @click="addNewProduct" />
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { AlertMixin } from '@/mixins/AlertMixin';
import { Component, Mixins } from 'vue-property-decorator';
import Firestore from '@/utils/Firestore';
import Product from '@/types/Product';
import VAlert from '@/components/VAlert.vue';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';
import VInput from '@/components/VInput.vue';
import VSelect from '@/components/VSelect.vue';

@Component({
  components: {
    VAlert,
    VButton,
    VHeader,
    VInput,
    VSelect
  }
})
export default class CustomProduct extends Mixins(AlertMixin) {
  categoriesList: string[] = [];
  customCategory = false;
  location?: string;
  product: Product = { name: '' };
  selectedCategory = '';

  async mounted() {
    this.location = this.$route.query.location as string;

    await this.getCategoriesList();
    this.selectedCategory = this.categoriesList[0];
  }

  async addNewProduct() {
    if (!this.product) {
      return;
    }
    this.trimProduct();

    if (await Firestore.instance.isProductInStorage(this.product)) {
      return await this.showAlert(`${this.product.name} already exists in the storage`);
    }
    if (await Firestore.instance.isProductInShoppingList(this.product)) {
      return await this.showAlert(`${this.product.name} already exists in the shopping list`);
    }

    await this.addProductToStorageOrShoppingList();
  }

  async addProductToStorageOrShoppingList() {
    this.trimProduct();

    if (this.location === 'storage') {
      await Firestore.instance.addProductToStorage(this.product);
      await router.safePush('/fridge');
    } else if (this.location === 'shoppingList') {
      await Firestore.instance.addToShoppingList(this.product);
      await router.safePush('/shopping-list');
    }
  }

  async getCategoriesList() {
    const allProducts = await Firestore.instance.getAllProducts();
    const productCategories = allProducts.map(product => product.category ?? 'General');
    this.categoriesList = [...new Set(productCategories)];
  }

  setSelectedCategory(value) {
    this.selectedCategory = value;
  }

  trimProduct() {
    this.product.name = this.product.name.trim();
    this.product.category = this.selectedCategory.trim();
  }
}
</script>
