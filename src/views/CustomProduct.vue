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
        :selected-item="form.productCategory"
        @change="setSelectedCategory"
      />
      <v-input
        v-if="customCategory"
        class="mb-8"
        data-cy="custom-product-category"
        type="text"
        placeholder="Pick Category Name"
        v-model="form.productCategory"
        :error="errorType === 'displayName'"
        @input="alertMessage = null"
      />
      <div v-if="errorFields['productCategory']?.[0]?.message" class="ml-1 text-dark-peach">
        {{ errorFields['productCategory']?.[0]?.message }}
      </div>
      <v-input
        class="mb-4"
        data-cy="custom-product-name"
        type="text"
        label="Item Name"
        placeholder="Enter Item Name"
        v-model="form.productName"
        :error="errorType === 'displayName'"
        @input="alertMessage = null"
      />
      <div v-if="errorFields['productName']?.[0]?.message" class="ml-1 text-dark-peach">
        {{ errorFields['productName']?.[0]?.message }}
      </div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button
        label="Add Item"
        class="mx-8 mt-3"
        data-cy="confirm-add-custom-product"
        @click="addNewProduct"
        :disabled="!pass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { AlertStatus, ListName, PathName } from '@/utils/enums';
import { CurrentFamily, Product } from '@/types';
import { VAlert, VButton, VHeader, VInput, VSelect } from '@/components';
import Firestore from '@/utils/Firestore';
import router from '@/router';
import { useRoute } from 'vue-router/composables';
import { useAlert } from '@/composables/useAlert';
import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { Rules } from 'async-validator';

const categoriesList = ref<string[]>([]);
const customCategory = ref(false);
const location = ref<string | undefined>(undefined);
const route = useRoute();
const { showAlert, alertMessage, alertStatus } = useAlert();

const form = reactive({ productCategory: '', productName: '' });
const rules: Rules = {
  productCategory: {
    type: 'string',
    required: true,
    message: 'Product Category is required'
  },
  productName: {
    type: 'string',
    required: true,
    message: 'Product Name is required'
  }
};

const { pass, errorFields } = useAsyncValidator(form, rules);

function getProduct() {
  return new Product(form.productName, form.productCategory);
}

async function getCategoriesList() {
  const allProducts = await CurrentFamily.instance.getAllProducts();

  const productCategories = allProducts.map(product => product.category);
  categoriesList.value = [...new Set(productCategories), 'Add New'];
}

function trimProduct() {
  form.productName = form.productName.trim();
  form.productCategory = form.productCategory.trim();
}

async function addProductToStorageOrShoppingList() {
  trimProduct();

  await CurrentFamily.instance.saveCustomProduct(getProduct());

  if (location.value === ListName.Storage) {
    await Firestore.instance.addToList([getProduct()], ListName.Storage);
    await router.safePush!(PathName.Storage);
  } else if (location.value === ListName.ShoppingList) {
    await Firestore.instance.addToList([getProduct()], ListName.ShoppingList);
    await router.safePush!(PathName.ShoppingList);
  }
}

async function addNewProduct() {
  if (!getProduct()) {
    return;
  }
  trimProduct();

  if (await Firestore.instance.isProductInStorage(getProduct())) {
    return await showAlert(`${form.productName} already exists in the storage`, AlertStatus.Danger);
  }
  if (await Firestore.instance.isProductInShoppingList(getProduct())) {
    return await showAlert(`${form.productName} already exists in the shopping list`, AlertStatus.Danger);
  }

  await addProductToStorageOrShoppingList();
}

function setSelectedCategory(value) {
  form.productCategory = value;
  if (form.productCategory === 'Add New') {
    customCategory.value = true;
    form.productCategory = '';
  } else {
    customCategory.value = false;
  }
}

onMounted(async () => {
  location.value = route.query.location as string;

  await getCategoriesList();
  form.productCategory = categoriesList.value[0];
});
</script>
