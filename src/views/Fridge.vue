<template>
  <div>
    <v-header heading="What's in your fridge?" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :isPositive="false" :label="alertMessage" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <products-list current-page="Fridge" :products="products" @remove="() => {}" @update="() => {}" />
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
import { Component, Mixins, Provide } from 'vue-property-decorator';
import NavigationMenu from '@/components/NavigationMenu.vue';
import { Product } from '@/types';
import ProductsList from '@/components/ProductsList.vue';
import SearchInput from '@/components/SearchInput.vue';
import VAlert from '@/components/VAlert.vue';
import VHeader from '@/components/VHeader.vue';
import { fridgeAction, fridgeActions } from '@/utils/consts';

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
  @Provide('currentPage') currentPage = 'Fridge';
  newProductCategory = '';
  newProductName = '';
  products: Product[] = [];
  searchQuery = '';

  async mounted() {
    this.onFamilyUpdate = family => {
      this.products = (family.storage ?? []).map(Product.fromDTO);
    };
  }

  get selectedProducts() {
    return this.products.filter(product => product.selected);
  }

  async performActionOnSelected(actionName: fridgeAction) {
    const { act, message } = fridgeActions[actionName];
    await Promise.all(this.selectedProducts.map(act));
    this.products = this.products.filter(product => !product.selected);
    await this.showAlert(message);
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      if (!Object.keys(acc).includes(product.category)) {
        acc[product.category] = [];
      }

      acc[product.category].push(product);

      return acc;
    }, {});
  }

  addNewProduct() {
    router.safePush({ path: '/new-product', query: { location: 'storage' } });
  }
}
</script>
