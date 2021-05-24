<template>
  <div>
    <v-header heading="Shopping List" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <products-list current-page="ShoppingList" :products="products" />
    </div>
    <v-fab
      v-if="!productsAreSelected"
      class="fixed bottom-0 right-0 mb-24 mr-5"
      data-cy="add-product"
      iconName="AddNew"
      @click="addNewProduct"
    />
    <div v-else class="fixed bottom-0 right-0 flex flex-col mb-24 mr-5">
      <v-fab class="mb-2" data-cy="delete" iconName="RemoveFAB" @click="performActionOnSelected('delete')" />
      <v-fab data-cy="purchase" iconName="Purchase" @click="performActionOnSelected('purchase')" />
    </div>
    <navigation-menu />
  </div>
</template>

<script lang="ts">
import { AlertMixin, ListenerMixin } from '@/mixins';
import { Component, Mixins, Provide } from 'vue-property-decorator';
import { ListName, PathName } from '@/utils/enums';
import { NavigationMenu, ProductsList, SearchInput, VAlert, VButton, VFab, VHeader } from '@/components';
import { ShoppingListAction, shoppingListActions } from '@/utils/consts';
import { Product } from '@/types';
import router from '@/router';

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
export default class ShoppingList extends Mixins(AlertMixin, ListenerMixin) {
  @Provide('currentPage') currentPage = ListName.ShoppingList;
  products: Product[] = [];
  searchQuery = '';
  unsubFamilyListener: (() => void) | undefined;

  async mounted() {
    this.onFamilyUpdate = family => {
      // TODO: figure out why we need this copy
      this.products = (family.shoppingList ?? []).map(p => new Product(p.name, p.category));
    };
  }

  get selectedProducts() {
    return this.products.filter(product => product.selected);
  }

  async performActionOnSelected(actionName: ShoppingListAction) {
    const { act, alert } = shoppingListActions[actionName];
    await act(this.selectedProducts);
    await this.showAlert(alert.message, alert.status);
  }

  addNewProduct() {
    router.safePush!({ path: PathName.NewProduct, query: { location: ListName.ShoppingList } });
  }

  get productsAreSelected(): boolean {
    return !this.products.every(p => !p.selected);
  }
}
</script>
