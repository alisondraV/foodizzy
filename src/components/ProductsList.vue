<template>
  <div>
    <search-input class="mb-4" v-model="searchQuery" />
    <div class="mb-4" v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
      <h2 class="text-primary-green mb-1">{{ category }}</h2>
      <hr class="text-secondary-text mb-2" />
      <div>
        <list-item
          v-for="product in filteredCategoryProducts[category]"
          :current-page="currentPage"
          :key="product.name"
          :product="product"
          @update="$emit('update', product)"
          @remove="$emit('remove', product)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ListItem from '@/components/ListItem.vue';
import Product from '@/types/Product';
import SearchInput from '@/components/SearchInput.vue';

@Component({
  components: { SearchInput, ListItem }
})
export default class ProductsList extends Vue {
  @Prop() products!: Product[];
  @Prop() currentPage!: string;
  searchQuery = '';

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
