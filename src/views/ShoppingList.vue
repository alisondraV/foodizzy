<template>
  <div>
    <v-header heading="Shopping List" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <search-input class="mb-6" v-model="searchQuery" />
      <v-button class="mb-4" @click="updateFridge" label="Update Fridge" />
      <div class="mb-4" v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
        <h2 class="text-primary-green mb-1">{{ category }}</h2>
        <hr class="text-secondary-text mb-2" />
        <div>
          <list-item
            v-for="product in filteredCategoryProducts[category]"
            current-page="ShoppingList"
            :key="product.name"
            :product="product"
            @remove="removeFromShoppingList"
            @update="checkShoppingItem"
          />
        </div>
      </div>
      <div class="fixed bottom-0 w-full flex justify-center mb-20 -mx-8">
        <img @click="addNewProduct" src="@/assets/images/AddNew.svg" alt="Add" class="p-4" />
      </div>
    </div>
    <navigation-menu current-page="ShoppingList" />
  </div>
</template>

<script lang="ts">
import ListItem from '@/components/ListItem.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import SearchInput from '@/components/SearchInput.vue';
import VAlert from '@/components/VAlert.vue';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';
import { ListenerMixin, AlertMixin } from '@/mixins';
import router from '@/router';
import ShoppingListItem from '@/types/ShoppingListItem';
import Firestore from '@/utils/Firestore';
import { Component, Mixins } from 'vue-property-decorator';

@Component({
  components: {
    ListItem,
    NavigationMenu,
    SearchInput,
    VAlert,
    VButton,
    VHeader
  }
})
export default class ShoppingList extends Mixins(AlertMixin, ListenerMixin) {
  products: ShoppingListItem[] = [];
  searchQuery = '';
  unsubFamilyListener: (() => void) | undefined;

  async mounted() {
    this.onFamilyUpdate = family => {
      this.products = this.getProductsWithCategory(family.shoppingList);
    };
  }

  addNewProduct() {
    router.safePush({ path: 'new-product', query: { location: 'shoppingList' } });
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: ShoppingListItem[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category ?? 'General';
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);

      return acc;
    }, {});
  }

  async removeFromShoppingList(product: ShoppingListItem) {
    this.products = this.products.filter(p => p.name != product.name);
    await Firestore.instance.removeFromShoppingList(product);
  }

  getProductsWithCategory(products: ShoppingListItem[]): ShoppingListItem[] {
    if (!products) {
      return [];
    }

    return products.map(product => {
      const productCategory = product.category ?? 'General';
      return {
        name: product.name,
        category: productCategory,
        acquired: product.acquired
      };
    });
  }

  async checkShoppingItem(shoppingItem: ShoppingListItem) {
    this.products = this.products.map(product => {
      return product.name == shoppingItem.name ? { ...product, acquired: !product.acquired } : product;
    });
    await Firestore.instance.updateShoppingList(this.products);
  }

  async updateFridge() {
    const acquiredProducts = this.products.filter(p => p.acquired);
    for (const product of acquiredProducts) {
      await this.removeFromShoppingList(product);
      await Firestore.instance.addProductToStorage(product);
    }

    await this.showAlert('Products were added to the fridge');
  }
}
</script>
