<template>
  <div>
    <v-header heading="Shopping List" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <products-list
        current-page="ShoppingList"
        :products="products"
        @remove="product => product.removeFromShoppingList()"
      />
      <div v-if="!productsAreSelected" class="fixed bottom-0 w-full flex justify-center mb-20 -mx-8">
        <img @click="addNewProduct" src="@/assets/images/AddNew.svg" alt="Add" class="p-4" />
      </div>
    </div>
    <div v-if="productsAreSelected" class="h-40 bottom-0 w-full fixed flex justify-end pr-4 pt-2">
      <v-button label="Update Fridge" @click="updateFridge" />
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

@Component({
  components: {
    NavigationMenu,
    ProductsList,
    SearchInput,
    VAlert,
    VButton,
    VHeader
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
    await Promise.all(this.selectedProducts.map(product => product.purchase()));

    await this.showAlert('Products were added to the fridge');
  }

  addNewProduct() {
    router.safePush({ path: 'new-product', query: { location: 'shoppingList' } });
  }

  get productsAreSelected(): boolean {
    return !this.products.every(p => !p.selected);
  }
}
</script>
