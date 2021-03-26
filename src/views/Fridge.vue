<template>
  <div>
    <v-header heading="What's in your fridge?" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :isPositive="false" :label="alertMessage" />
    </div>
    <div class="mb-40 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <search-input class="mb-4" v-model="searchQuery" />
      <button class="border" @click="performActionOnSelected('waste')">waste</button>
      <button class="border" @click="performActionOnSelected('consume')">consume</button>
      <button class="border" @click="performActionOnSelected('delete')">delete</button>
      <ul>
        <li class="mb-4" v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
          <h2 class="text-primary-green mb-1">{{ category }}</h2>
          <hr class="text-secondary-text mb-2" />
          <ul>
            <li
              class="flex justify-between py-3 text-xl left-0"
              v-for="product in filteredCategoryProducts[category]"
              :key="product.name"
            >
              <input type="checkbox" name="selected" v-model="product.selected" />
              <!-- <img src="@/assets/images/Check.svg" alt="Finished" @click="markAsFinished(product)" /> -->
              <span class="flex-1 ml-4 text-primary-text">{{ product.name }}</span>
              <!-- <img src="@/assets/images/Waste.svg" alt="Wasted" @click="markAsWasted(product)" /> -->
            </li>
          </ul>
        </li>
      </ul>
      <div class="fixed bottom-0 w-full flex justify-center mb-20 -mx-8">
        <img @click="addNewProduct" src="@/assets/images/AddNew.svg" alt="Add" class="p-4" />
      </div>
    </div>
    <navigation-menu current-page="Fridge" />
  </div>
</template>

<script lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue';
import SearchInput from '@/components/SearchInput.vue';
import VAlert from '@/components/VAlert.vue';
import VHeader from '@/components/VHeader.vue';
import { AlertMixin, ListenerMixin } from '@/mixins';
import router from '@/router';
import { Product } from '@/types';
import { fridgeAction, fridgeActions } from '@/utils/consts';
import { Component, Mixins } from 'vue-property-decorator';

@Component({
  components: {
    NavigationMenu,
    SearchInput,
    VAlert,
    VHeader
  }
})
export default class Fridge extends Mixins(AlertMixin, ListenerMixin) {
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
