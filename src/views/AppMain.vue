<template>
  <div>
    <h1>Main</h1>
    <button @click="goToFridgePage">Go to your fridge</button>
    <button @click="goToShoppingList">Go to your shopping list</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";

@Component
export default class AppMain extends Vue {
  goToFridgePage() {
    router.push("/fridge");
  }
  goToShoppingList() {
    router.push("/shopping-list");
  }
}
</script>