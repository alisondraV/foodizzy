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
      class="fixed bottom-0 w-full flex justify-center mb-24"
      iconName="AddNew"
      @click="addNewProduct"
    />
    <div v-else class="fixed bottom-0 right-0 flex flex-col mb-24 mr-3">
      <v-fab class="mb-2" iconName="RemoveFAB" @click="performActionOnSelected('delete')" />
      <v-fab iconName="Purchase" @click="performActionOnSelected('purchase')" />
    </div>
    <navigation-menu current-page="ShoppingList" />
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { Component, Mixins, Provide } from 'vue-property-decorator';
import { ListenerMixin, AlertMixin } from '@/mixins';
import NavigationMenu from '@/components/NavigationMenu.vue';
import { Product } from '@/types/Product';
import ProductsList from '@/components/ProductsList.vue';
import SearchInput from '@/components/SearchInput.vue';
import VAlert from '@/components/VAlert.vue';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';
import VFab from '@/components/VFab.vue';
import { ShoppingListAction, shoppingListActions } from '@/utils/consts';

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
  @Provide('currentPage') currentPage = 'ShoppingList';
  products: Product[] = [];
  searchQuery = '';
  unsubFamilyListener: (() => void) | undefined;

  async mounted() {
    this.onFamilyUpdate = family => {
      this.products = (family.shoppingList ?? []).map(Product.fromDTO);
    };
  }

  get selectedProducts() {
    return this.products.filter(product => product.selected);
  }

  async updateFridge() {
    await Product.purchaseAll(this.selectedProducts);
    await this.showAlert('Products were added to the fridge');
  }

  async performActionOnSelected(actionName: ShoppingListAction) {
    const { act, alert } = shoppingListActions[actionName];
    await act(this.selectedProducts);
    await this.showAlert(alert.message, alert.status);
  }

  addNewProduct() {
    router.safePush({ path: 'new-product', query: { location: 'shoppingList' } });
  }

  get productsAreSelected(): boolean {
    return !this.products.every(p => !p.selected);
  }
}
</script>
