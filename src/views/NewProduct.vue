<template>
  <div>
    <v-header heading="Add New Item" />
    <div class="mt-20 mb-20 mx-8">
      <products-list
        current-page="NewProduct"
        :products="products"
        @remove="removeExistingProduct"
        @update="toggleProduct"
      />
    </div>
    <div class="bg-background h-20 w-full bottom-0 fixed flex px-8 text-sm">
      <v-button class="mt-3 mr-2 flex-1" label="Add custom product" @click="addCustomProduct" />
      <v-button class="mt-3 flex-1" label="Add items to the list" @click="addItemsToTheList" />
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { Component, Vue } from 'vue-property-decorator';
import Firestore from '@/utils/Firestore';
import ListItem from '@/components/ListItem.vue';
import Product from '@/types/Product';
import SearchInput from '@/components/SearchInput.vue';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';
import ProductsList from '@/components/ProductsList.vue';

@Component({
  components: {
    ProductsList,
    ListItem,
    SearchInput,
    VButton,
    VHeader
  }
})
export default class NewProduct extends Vue {
  location?: string;
  products: Product[] = [];
  searchQuery = '';

  async mounted() {
    this.location = this.$route.query.location as string;
    this.products = await this.getProductsWithCategory();
  }

  addCustomProduct() {
    router.safePush({
      path: 'custom-product',
      query: { location: this.location }
    });
  }

  toggleProduct(productToUpdate: Product) {
    this.products = this.products.map(product => {
      return product.name == productToUpdate.name ? { ...product, acquired: !product.acquired } : product;
    });
  }

  async removeExistingProduct(product: Product) {
    if (this.location === 'storage') {
      await Firestore.instance.removeFromStorage(product);
    } else if (this.location === 'shoppingList') {
      await Firestore.instance.removeFromShoppingList(product);
    }
  }

  async addItemsToTheList() {
    const acquiredProducts = this.products.filter(p => p.acquired);

    for (const product of acquiredProducts) {
      if (this.location === 'storage') {
        await Firestore.instance.addProductToStorage(product);
      } else if (this.location === 'shoppingList') {
        await Firestore.instance.addToShoppingList(product);
      }
    }

    router.back();
  }
}
</script>
