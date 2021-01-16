<template>
  <div
    class="bg-background flex justify-between h-16 px-5 w-full bottom-0 fixed"
  >
    <img
      src="@/assets/images/Home.svg"
      alt="Home"
      @click="goToTheHomePage"
      class="cursor-pointer p-4"
    />
    <img
      src="@/assets/images/Fridge.svg"
      alt="Home"
      @click="goToTheFridgePage"
      class="cursor-pointer p-4"
    />
    <img
      src="@/assets/images/ShoppingList.svg"
      alt="ShoppingList"
      @click="goToTheShoppingList"
      class="cursor-pointer p-4"
    />
    <img
      src="@/assets/images/Recipes.svg"
      alt="Recipes"
      @click="goToTheRecipesPage"
      class="cursor-pointer p-4"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "../router";

@Component
export default class NavigationMenu extends Vue {
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
