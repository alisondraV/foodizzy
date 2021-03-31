<template>
  <div>
    <v-header heading="What's in your fridge?" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <products-list current-page="Fridge" :products="products" />
      <v-fab
        v-if="!productsAreSelected"
        class="fixed bottom-0 w-full flex justify-center mb-20 -mx-8 p-4"
        iconName="AddNew"
        @click="addNewProduct"
      />
    </div>
    <div
      v-if="productsAreSelected"
      class="h-full fixed top-0 right-0 flex flex-col justify-end pr-4 pt-2 pb-20"
    >
      <v-fab class="w-20 my-2" iconName="RemoveFAB" @click="performActionOnSelected('delete')" />
      <v-fab class="w-20 my-2" iconName="WasteFAB" @click="performActionOnSelected('waste')" />
      <v-fab class="w-20 my-2" iconName="MoveToShoppingList" @click="performActionOnSelected('consume')" />
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
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';
import VFab from '@/components/VFab.vue';
import { FridgeAction, fridgeActions } from '@/utils/consts';

@Component({
  components: {
    NavigationMenu,
    ProductsList,
    SearchInput,
    VAlert,
    VButton,
    VHeader,
    VFab
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

  async performActionOnSelected(actionName: FridgeAction) {
    const { act, alert } = fridgeActions[actionName];
    await Promise.all(this.selectedProducts.map(act));
    await this.showAlert(alert.message, alert.status);
  }

  addNewProduct() {
    router.safePush({ path: '/new-product', query: { location: 'storage' } });
  }

  get productsAreSelected(): boolean {
    return !this.products.every(p => !p.selected);
  }
}
</script>
