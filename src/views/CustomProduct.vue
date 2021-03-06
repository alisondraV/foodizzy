<template>
  <div>
    <v-header heading="Add Custom Item" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <v-select
        class="mb-4"
        data-cy="custom-product-category-dropdown"
        label="Category"
        :selection-list="categoriesList"
        :selected-item="product.category"
        @change="setSelectedCategory"
      />
      <v-input
        v-if="customCategory"
        class="mb-8"
        data-cy="custom-product-category"
        type="text"
        placeholder="Pick Category Name"
        v-model="product.category"
        :error="errorType === 'displayName'"
        @input="alertMessage = null"
      />
      <v-input
        class="mb-4"
        data-cy="custom-product-name"
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
      <v-button
        label="Add Item"
        class="mx-8 mt-3"
        data-cy="confirm-add-custom-product"
        @click="addNewProduct"
        :disabled="validationFailed"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AlertMixin, ValidationMixin } from '@/mixins';
import { AlertStatus, ListName, PathName } from '@/utils/enums';
import { Component, Mixins } from 'vue-property-decorator';
import { CurrentFamily, Product } from '@/types';
import { VAlert, VButton, VHeader, VInput, VSelect } from '@/components';
import Firestore from '@/utils/Firestore';
import router from '@/router';

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
      return await this.showAlert(`${this.product.name} already exists in the storage`, AlertStatus.Danger);
    }
    if (await Firestore.instance.isProductInShoppingList(this.product)) {
      return await this.showAlert(
        `${this.product.name} already exists in the shopping list`,
        AlertStatus.Danger
      );
    }

    await this.addProductToStorageOrShoppingList();
  }

  async addProductToStorageOrShoppingList() {
    this.trimProduct();

    await CurrentFamily.instance.saveCustomProduct(this.product);

    if (this.location === ListName.Storage) {
      await Firestore.instance.addToList([this.product], ListName.Storage);
      await router.safePush!(PathName.Storage);
    } else if (this.location === ListName.ShoppingList) {
      await Firestore.instance.addToList([this.product], ListName.ShoppingList);
      await router.safePush!(PathName.ShoppingList);
    }
  }

  async getCategoriesList() {
    const allProducts = await CurrentFamily.instance.getAllProducts();
    const productCategories = allProducts.map(product => product.category);
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
