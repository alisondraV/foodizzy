<template>
  <div>
    <search-input class="mb-6" v-model="searchQuery" />
    <div class="mb-4" v-for="category in Object.keys(filteredCategoryProducts)" :key="category">
      <div class="flex mb-1" @click="toggleCategoryVisibility(category)">
        <img
          v-if="categoriesVisibility[category]"
          alt="ArrowDown"
          class="mr-2"
          src="@/assets/images/ArrowDown.svg"
        />
        <img v-else alt="ArrowUp" class="mr-2" src="@/assets/images/ArrowUp.svg" />
        <h2 class="text-primary-green">{{ category }}</h2>
      </div>
      <hr class="text-secondary-text mb-2" />
      <div v-if="!categoriesVisibility[category]">
        <list-item
          v-for="product in filteredCategoryProducts[category]"
          :current-page="currentPage"
          :key="product.name"
          :product="product"
          @remove="$emit('remove', product)"
          @update="$emit('update', product)"
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
  @Prop({ default: true }) allCollapsed?: boolean;
  categoriesVisibility = {};
  searchQuery = '';

  get filteredCategoryProducts() {
    const reducedProducts = this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

    type Category = { [category: string]: Product[] };
    return reducedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category!;
      if (!Object.keys(acc).includes(categoryName)) {
        this.updateCategoryVisibilityList(categoryName);
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);

      return acc;
    }, {});
  }

  toggleCategoryVisibility(categoryToToggle: string) {
    this.categoriesVisibility[categoryToToggle] = !this.categoriesVisibility[categoryToToggle];
    this.$forceUpdate();
  }

  updateCategoryVisibilityList(categoryName: string) {
    const prevValue = this.categoriesVisibility[categoryName];
    const isCollapsed = prevValue === undefined ? this.allCollapsed : prevValue;
    this.categoriesVisibility[categoryName] = isCollapsed;
  }
}
</script>
