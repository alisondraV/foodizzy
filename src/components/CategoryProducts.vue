<template>
  <div>
    <div class="flex mb-1" @click="toggleCategoryVisibility">
      <img v-if="collapsed" alt="ArrowDown" class="mr-2" src="@/assets/images/ArrowDown.svg" />
      <img v-else alt="ArrowUp" class="mr-2" src="@/assets/images/ArrowUp.svg" />
      <h2 class="text-primary-green">{{ category }}</h2>
    </div>
    <hr class="text-secondary-text mb-2" />
    <div v-if="!collapsed">
      <list-item v-for="product in products" :key="product.name" :product="product" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ListItem from '@/components/ListItem.vue';
import { Product } from '@/types';
import SearchInput from '@/components/SearchInput.vue';

@Component({
  components: { SearchInput, ListItem }
})
export default class CategoryProducts extends Vue {
  @Prop() products!: Product[];

  private collapsed = true;
  category = this.products[0].category;

  get localStorageKey() {
    return `${window.location.pathname}/${this.category}`;
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
