<template>
  <div>
    <v-header heading="What's in your fridge?" />
    <div class="mt-20">
      <v-alert
        v-if="alertMessage"
        :isPositive="!productWasWasted"
        :label="alertMessage"
        :wasted="productWasWasted"
      />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <products-list
        current-page="Fridge"
        :products="products"
        @remove="markAsWasted"
        @update="markAsFinished"
      />
      <div class="fixed bottom-0 w-full flex justify-center mb-20 -mx-8">
        <img @click="addNewProduct" src="@/assets/images/AddNew.svg" alt="Add" class="p-4" />
      </div>
    </div>
    <navigation-menu current-page="Fridge" />
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { AlertMixin, ListenerMixin } from '@/mixins';
import { Component, Mixins } from 'vue-property-decorator';
import Firestore from '@/utils/Firestore';
import NavigationMenu from '@/components/NavigationMenu.vue';
import Product from '@/types/Product';
import ProductsList from '@/components/ProductsList.vue';
import SearchInput from '@/components/SearchInput.vue';
import VAlert from '@/components/VAlert.vue';
import VHeader from '@/components/VHeader.vue';

@Component({
  components: {
    NavigationMenu,
    ProductsList,
    SearchInput,
    VAlert,
    VHeader
  }
})
export default class Fridge extends Mixins(AlertMixin, ListenerMixin) {
  newProductCategory = '';
  newProductName = '';
  products: Product[] = [];
  productWasWasted = false;
  searchQuery = '';

  async mounted() {
    this.onFamilyUpdate = family => {
      this.products = this.getProductsWithCategory(family.storage);
    };
  }

  async markAsFinished(product: Product) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromStorage(product);
    await Firestore.instance.addToShoppingList(product);

    await this.showAlert(`${product.name} was added to the shopping list`);
  }

  async markAsWasted(product: Product) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromStorage(product);
    await Firestore.instance.moveToWasted(product);
    await Firestore.instance.addToShoppingList(product);

    this.productWasWasted = true;
    await this.showAlert(`${product.name} was wasted`);
    this.productWasWasted = false;
  }

  addNewProduct() {
    router.safePush({ path: '/new-product', query: { location: 'storage' } });
  }

  getProductsWithCategory(products: Product[]): Product[] {
    if (!products) {
      return [];
    }

    return products.map(product => {
      const productCategory = product.category ?? 'General';
      return { name: product.name, category: productCategory };
    });
  }
}
</script>
