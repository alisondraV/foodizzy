<template>
  <div>
    <v-header heading="Recipes" />
    <div class="mt-24 mb-20 mx-8">
      <figure class="m-10 rounded" v-for="recipe in recipes" :key="recipe.name">
        <recipe-component :recipe="recipe" />
      </figure>
    </div>
    <navigation-menu current-page="Recipes" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Recipe from "@/types/Recipe";
import VHeader from "@/components/VHeader.vue";
import RecipeComponent from "@/components/RecipeComponent.vue";
import { CurrentFamily } from "@/types";

@Component({
  components: {
    RecipeComponent,
    NavigationMenu,
    VHeader
  }
})
export default class Recipes extends Vue {
  recipes: Recipe[] = [];

  async mounted() {
    this.recipes = await CurrentFamily.instance.getRecipes();
  }
}
</script>
