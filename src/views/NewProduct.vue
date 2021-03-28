<template>
  <div>
    <v-header heading="Add New Item" />
    <div class="mt-20 mb-20 mx-8">
      <search-input class="mb-4" v-model="searchQuery" />
      <div class="mb-4" v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
        <h2 class="text-primary-green mb-1">{{ category }}</h2>
        <hr class="text-secondary-text mb-2" />
        <div>
          <list-item
            v-for="product in filteredCategoryProducts[category]"
            current-page="NewProduct"
            :key="product.name"
            :product="product"
            @update="toggleProduct"
            @remove="removeExistingProduct"
          />
        </div>
      </div>
    </div>
    <div class="bg-background h-20 w-full bottom-0 fixed flex px-8 text-sm">
      <v-button class="mt-3 mr-2 px flex-1" label="Add custom product" @click="addCustomProduct" />
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
import ShoppingListItem from '@/types/ShoppingListItem';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';

@Component({
  components: {
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

  async toggleProduct(productToUpdate: ShoppingListItem) {
    this.products = this.products.map(product => {
      return product.name == productToUpdate.name ? { ...product, acquired: !product.acquired } : product;
    });
  }

  async removeExistingProduct(shoppingItem: ShoppingListItem) {
    this.products = this.product.map(product => {
      return product.name == shoppingItem.name ? { ...product, acquired: !product.acquired } : product;
    });
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

  async getProductsWithCategory() {
    const allProducts = await this.getProductsForLocation();

    return allProducts.map(product => {
      const productCategory = product.category ?? 'General';
      return { name: product.name, category: productCategory, acquired: false };
    });
  }

  async getProductsForLocation() {
    const allProducts = await Firestore.instance.getAllProducts();
    const availableProducts = [];

    for (const product of allProducts) {
      if (await this.isAvailableForTheCurrentPage(product)) {
        availableProducts.push(product);
      }
    }

    return availableProducts;
  }

  private async isAvailableForTheCurrentPage(product: Product) {
    const isInStorage = await Firestore.instance.isProductInStorage(product);
    const isInShoppingList = await Firestore.instance.isProductInShoppingList(product);

    return (
      (this.location === 'storage' && !isInStorage) || (this.location === 'shoppingList' && !isInShoppingList)
    );
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
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
}
</script>
