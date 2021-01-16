<template>
  <div>
    <button @click="goToFridgePage">Go to your fridge</button>
    <button @click="goToShoppingList">Go to your shopping list</button>
    <button @click="goToRecipes">Go to your recipes</button>
    <button @click="goToProfile">Go to your profile</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "../router";

@Component
export default class Menu extends Vue {
  goToFridgePage() {
    router.push("/fridge");
  }
  goToShoppingList() {
    router.push("/shopping-list");
  }
  goToProfile() {
    router.push("/profile");
  }
  goToRecipes() {
    router.push("/recipes");
  }
}
</script>
