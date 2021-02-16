<template>
  <div
    class="bg-background flex justify-between h-16 px-5 w-full bottom-0 fixed"
  >
    <img
      src="@/assets/images/Home.svg"
      alt="Home"
      @click="goToTheHomePage"
      class="cursor-pointer p-4"
      :style="isCurrentPageStyle('Home')"
    />
    <img
      src="@/assets/images/Fridge.svg"
      alt="Fridge"
      @click="goToTheFridgePage"
      class="cursor-pointer p-4"
      :style="isCurrentPageStyle('Fridge')"
    />
    <img
      src="@/assets/images/ShoppingList.svg"
      alt="ShoppingList"
      @click="goToTheShoppingList"
      class="cursor-pointer p-4"
      :style="isCurrentPageStyle('ShoppingList')"
    />
    <img
      src="@/assets/images/Recipes.svg"
      alt="Recipes"
      @click="goToTheRecipesPage"
      class="cursor-pointer p-4"
      :style="isCurrentPageStyle('Recipes')"
    />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import router from "../router";

@Component
export default class NavigationMenu extends Vue {
  @Prop() currentPage!: string;

  isCurrentPageStyle(page: string) {
    return page == this.currentPage
      ? "filter: invert(31%) sepia(38%) saturate(6483%) " +
          "hue-rotate(160deg) brightness(91%) contrast(99%)"
      : "";
  }
  goToTheHomePage() {
    router.push("/home");
  }
  goToTheFridgePage() {
    router.push("/fridge");
  }
  goToTheShoppingList() {
    router.push("/shopping-list");
  }
  goToTheRecipesPage() {
    router.push("/recipes");
  }
}
</script>
