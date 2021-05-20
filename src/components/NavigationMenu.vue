<template>
  <div
    class="bg-background flex justify-between h-20 px-5 w-full bottom-0 fixed"
    style="box-shadow: #F0F0F0 0 -10px 20px"
  >
    <img
      src="@/assets/images/Statistics.svg"
      alt="Home"
      @click="goToTheHomePage"
      class="mb-6 p-3"
      :style="isCurrentPageStyle('Home')"
    />
    <img
      src="@/assets/images/Storage.svg"
      alt="Storage"
      @click="goToTheStoragePage"
      class="mb-6 p-3"
      :style="isCurrentPageStyle('Storage')"
    />
    <img
      src="@/assets/images/ShoppingList.svg"
      alt="ShoppingList"
      @click="goToTheShoppingList"
      class="mb-6 p-3"
      :style="isCurrentPageStyle('ShoppingList')"
    />
    <img
      src="@/assets/images/Recipes.svg"
      alt="Recipes"
      @click="goToTheRecipesPage"
      class="mb-6 p-3"
      :style="isCurrentPageStyle('Recipes')"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import router from '../router';

@Component
export default class NavigationMenu extends Vue {
  @Prop() currentPage!: string;

  isCurrentPageStyle(page: string) {
    return page == this.currentPage
      ? 'filter: invert(31%) sepia(38%) saturate(6483%) hue-rotate(160deg) brightness(91%) contrast(99%)'
      : '';
  }
  goToTheHomePage() {
    router.safePush('/');
  }
  goToTheStoragePage() {
    router.safePush('/storage');
  }
  goToTheShoppingList() {
    router.safePush('/shopping-list');
  }
  goToTheRecipesPage() {
    router.safePush('/recipes');
  }
}
</script>
