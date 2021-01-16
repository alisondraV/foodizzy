<template>
  <div>
    <h1>Recipes</h1>
    <h2 v-for="recipe in recipes" :key="recipe.id">{{ recipe }}</h2>
    <button @click="getRecipes">Get recipes</button>
    <navigation-menu />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import NavigationMenu from "@/components/NavigationMenu.vue";

@Component({
  components: {
    NavigationMenu
  }
})
export default class Recipes extends Vue {
  recipes: Array<string> = [];

  async getRecipes() {
    this.recipes = await Firestore.instance.getRecipes();
  }
}
</script>
