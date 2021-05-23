<template>
  <div>
    <v-header heading="What's in your storage?" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <products-list current-page="Storage" :products="products" />
    </div>
    <v-fab
      v-if="!productsAreSelected"
      class="fixed bottom-0 right-0 mb-24 mr-5"
      data-cy="add-product"
      iconName="AddNew"
      @click="addNewProduct"
    />
    <div v-else class="fixed bottom-0 right-0 flex flex-col mb-24 mr-5">
      <v-fab class="mb-2" data-cy="remove" iconName="RemoveFAB" @click="performActionOnSelected('delete')" />
      <v-fab class="mb-2" data-cy="waste" iconName="WasteFAB" @click="performActionOnSelected('waste')" />
      <v-fab data-cy="consume" iconName="MoveToShoppingList" @click="performActionOnSelected('consume')" />
    </div>
    <navigation-menu />
  </div>
</template>

<script lang="ts">
import { AlertMixin, ListenerMixin } from '@/mixins';
import { Component, Mixins, Provide } from 'vue-property-decorator';
import { ListName, StorageAction, storageActions } from '@/utils/consts';
import { NavigationMenu, ProductsList, VAlert, VButton, VFab, VHeader } from '@/components';
import { Product } from '@/types';
import router from '@/router';

@Component({
  components: {
    NavigationMenu,
    ProductsList,
    VAlert,
    VButton,
    VHeader,
    VFab
  }
})
export default class Storage extends Mixins(AlertMixin, ListenerMixin) {
  @Provide('currentPage') currentPage: ListName = 'storage';
  newProductCategory = '';
  newProductName = '';
  products: Product[] = [];
  searchQuery = '';

  async mounted() {
    this.onFamilyUpdate = family => {
      // TODO: figure out why we need this copy
      this.products = (family.storage ?? []).map(p => new Product(p.name, p.category));
    };
  }

  get selectedProducts() {
    return this.products.filter(product => product.selected);
  }

  async performActionOnSelected(actionName: StorageAction) {
    const { act, alert } = storageActions[actionName];
    await act(this.selectedProducts);
    await this.showAlert(alert.message, alert.status);
  }

  addNewProduct() {
    router.safePush!({ path: '/new-product', query: { location: 'storage' } });
  }

  get productsAreSelected(): boolean {
    return !this.products.every(p => !p.selected);
  }
}
</script>
