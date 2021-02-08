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
import {Component, Vue} from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Authentication from "@/utils/Authentication";
import Recipe from "@/types/Recipe";
import Family from "@/types/Family";
import VHeader from "@/components/VHeader.vue";
import RecipeComponent from "@/components/RecipeComponent.vue";

@Component({
  components: {
    RecipeComponent,
    NavigationMenu,
    VHeader
  }
})
export default class Recipes extends Vue {
  recipes: Recipe[] = [];
  family: Family | null = null;

  async mounted() {
    this.family = await Authentication.instance.getFamily();
    this.recipes = await Firestore.instance.getRecipesForFamily(this.family);
  }
}
</script>
