<template>
  <div>
    <h1>Recipes</h1>
    <h2 v-for="recipe in recipes" :key="recipe.id">{{ recipe }}</h2>
    <button @click="getRecipes">Get recipes</button>
    <button @click="goBack">Back</button>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";

@Component
export default class Recipes extends Vue {
  recipes: Array<string> = [];

  async getRecipes() {
    this.recipes = await Firestore.instance.getRecipes();
  }
  goBack() {
    router.back();
  }
}
</script>
