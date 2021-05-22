<template>
  <div>
    <search-input class="mb-6" v-model="searchQuery" />
    <div v-if="currentPage === 'newProduct'" class="mb-6">
      <div
        class="flex mb-2 text-primary-green font-bold"
        data-cy="add-custom-product"
        @click="addCustomProduct"
      >
        <img alt="AddCustom" class="mr-2" src="@/assets/images/Plus.svg" />
        <span>Add Custom Product</span>
      </div>
      <hr class="text-secondary-text" />
    </div>
    <div class="mb-4" v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
      <category-products :products="filteredCategoryProducts[category]" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import { CategoryProducts } from '@/components';
import { Product } from '@/types';
import SearchInput from '@/components/SearchInput.vue';
import router from '@/router';

@Component({
  components: { CategoryProducts, SearchInput }
})
export default class ProductsList extends Vue {
  @Prop() location!: string;
  @Prop() products!: Product[];
  @Inject('currentPage') currentPage!: string;
  searchQuery = '';

  addCustomProduct() {
    router.safePush({
      path: 'custom-product',
      query: { location: this.location }
    });
  }

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category!;
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);

      return acc;
    }, {});
  }
}
</script>
