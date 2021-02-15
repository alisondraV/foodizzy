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
import Firestore from "@/utils/Firestore";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Authentication from "@/utils/Authentication";
import Recipe from "@/types/Recipe";
import Family from "@/types/Family";
import firebase from "firebase";
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
  user: firebase.User | null = null;
  family: Family | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    console.log(this.user!.uid);

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    this.recipes = await Firestore.instance.getRecipesForFamily(this.family);
  }
}
</script>
