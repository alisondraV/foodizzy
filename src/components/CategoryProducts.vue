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
      <list-item v-for="product in products" :key="product.name" :product="product" />
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
  @Prop({ default: true }) isCollapsedByDefault?: boolean;

  collapsed = this.isCollapsedByDefault;
  category = this.products[0].category;

  toggleCategoryVisibility() {
    this.collapsed = !this.collapsed;
  }
}
</script>
