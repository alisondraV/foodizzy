<template>
  <div>
    <v-header heading="Add Custom Item" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <v-select
        class="mb-4"
        label="Category"
        :selection-list="categoriesList"
        :selected-item="product.category"
        @change="setSelectedCategory"
      />
      <v-input
        v-if="customCategory"
        class="mb-8"
        type="text"
        placeholder="Pick Category Name"
        v-model="product.category"
        :error="errorType === 'displayName'"
        @input="alertMessage = null"
      />
      <v-input
        class="mb-4"
        type="text"
        label="Item Name"
        placeholder="Enter Item Name"
        v-model="product.name"
        :error="errorType === 'displayName'"
        @input="alertMessage = null"
      />
      <div v-if="errorMessage" class="ml-1 text-dark-peach">{{ errorMessage }}</div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button label="Add Item" class="mx-8 mt-3" @click="addNewProduct" :disabled="validationFailed" />
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { AlertMixin, ValidationMixin } from '@/mixins';
import { Component, Mixins } from 'vue-property-decorator';
import Firestore from '@/utils/Firestore';
import { Product } from '@/types';
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
export default class CustomProduct extends Mixins(AlertMixin, ValidationMixin) {
  categoriesList: string[] = [];
  customCategory = false;
  location?: string;
  product: Product = new Product('', '');

  async mounted() {
    this.location = this.$route.query.location as string;

    await this.getCategoriesList();
    this.product.category = this.categoriesList[0];
  }

  async addNewProduct() {
    if (!this.product) {
      return;
    }
    this.trimProduct();

    if (await Firestore.instance.isProductInStorage(this.product)) {
      return await this.showAlert(`${this.product.name} already exists in the storage`, 'danger');
    }
    if (await Firestore.instance.isProductInShoppingList(this.product)) {
      return await this.showAlert(`${this.product.name} already exists in the shopping list`, 'danger');
    }

    await this.addProductToStorageOrShoppingList();
  }

  async addProductToStorageOrShoppingList() {
    this.trimProduct();

    if (this.location === 'storage') {
      await Firestore.instance.addToList([this.product], 'storage');
      await router.safePush('/fridge');
    } else if (this.location === 'shoppingList') {
      await Firestore.instance.addToList([this.product], 'shoppingList');
      await router.safePush('/shopping-list');
    }
  }

  async getCategoriesList() {
    const allProducts = await Firestore.instance.getAllProducts();
    const productCategories = allProducts.map(product => product.category ?? 'General');
    this.categoriesList = [...new Set(productCategories), 'Add New'];
  }

  get isFormInValidState() {
    return this.isDisplayNameValid(this.product.name) && this.isDisplayNameValid(this.product.category!);
  }

  setSelectedCategory(value) {
    this.product.category = value;
    if (this.product.category === 'Add New') {
      this.customCategory = true;
      this.product.category = '';
    } else {
      this.customCategory = false;
    }
  }

  trimProduct() {
    this.product.name = this.product.name.trim();
    this.product.category = this.product.category!.trim();
  }
}
</script>
