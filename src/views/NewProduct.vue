<template>
  <div>
    <v-header heading="Add New Item" />
    <div class="mt-24 mb-20 mx-8">
      <search-input class="mb-4" v-model="searchQuery" />
      <v-button
        class="mb-4"
        label="Add Custom Product"
        @click="addCustomProduct"
      />
      <div
        class="mb-4"
        v-for="category in Object.keys(filteredCategoryProducts)"
        :key="category"
      >
        <h2 class="text-primary-green mb-1">{{ category }}</h2>
        <hr class="text-secondary-text mb-2" />
        <div>
          <list-item
            v-for="product in filteredCategoryProducts[category]"
            current-page="NewProduct"
            :key="product.name"
            :product="product"
            @remove="removeExistingProduct"
            @add="resolveNewProduct"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Firestore from '@/utils/Firestore';
import Product from '@/types/Product';
import router from '@/router';
import VHeader from '@/components/VHeader.vue';
import SearchInput from '@/components/SearchInput.vue';
import ListItem from '@/components/ListItem.vue';
import VButton from '@/components/VButton.vue';

@Component({
  components: {
    VButton,
    ListItem,
    SearchInput,
    VHeader
  }
})
export default class NewProduct extends Vue {
  location?: string;
  products: Product[] = [];
  searchQuery = '';

  async mounted() {
    this.products = await this.getProductsWithCategory();
    this.location = this.$route.query.location as string;
  }

  addCustomProduct() {
    router.push({ path: 'custom-product', query: { location: this.location } });
  }

  async removeExistingProduct(product: Product) {
    if (this.location === 'storage') {
      await Firestore.instance.removeFromStorage(product);
    } else if (this.location === 'shoppingList') {
      await Firestore.instance.removeFromShoppingList(product);
    }
  }

  async resolveNewProduct(product: Product) {
    if (this.location === 'storage') {
      await Firestore.instance.addProductToStorage(product);
    } else if (this.location === 'shoppingList') {
      await Firestore.instance.addToShoppingList(product);
    }
    router.back();
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category ?? 'General';
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);

      return acc;
    }, {});
  }

  async getProductsWithCategory() {
    const allProducts = await Firestore.instance.getAllProducts();
    return allProducts.map(product => {
      const productCategory = product.category ?? 'General';
      return { name: product.name, category: productCategory };
    });
  }
}
</script>
