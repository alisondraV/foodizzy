<template>
  <div>
    <div class="flex mb-1" @click="toggleCategoryVisibility">
      <img
        alt="Arrow"
        class="mr-2"
        :class="collapsed ? '' : 'transform rotate-180'"
        src="@/assets/images/Arrow.svg"
      />
      <h2 class="text-primary-green">{{ category }}</h2>
    </div>
    <hr class="text-secondary-text mb-2" />
    <div v-if="!collapsed">
      <list-item v-for="product in sortedProducts" :key="product.name" :product="product" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ListItem from '@/components/ListItem.vue';
import { Product } from '@/types';

@Component({
  components: { ListItem }
})
export default class CategoryProducts extends Vue {
  @Prop() products!: Product[];

  private collapsed = true;
  category = this.products[0].category;

  get localStorageKey() {
    return `${window.location.pathname}/${this.category}`;
  }

  get sortedProducts() {
    const sortedProducts: Product[] = [];
    const productNames = this.products.map(product => product.name).sort();

    productNames.forEach(name => {
      this.products.forEach(product => {
        if (product.name === name) {
          sortedProducts.push(product);
        }
      });
    });
    return sortedProducts;
  }

  mounted() {
    if (localStorage.getItem(this.localStorageKey)) {
      this.collapsed = false;
    }
  }

  toggleCategoryVisibility() {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      localStorage.removeItem(this.localStorageKey);
    } else {
      localStorage.setItem(this.localStorageKey, '1');
    }
  }
}
</script>
