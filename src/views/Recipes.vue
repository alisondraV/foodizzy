<template>
  <div>
    <v-header heading="Recipes" />
    <figure class="m-10 rounded" v-for="recipe in recipes" :key="recipe.name">
      <img class="h-40 w-full object-cover rounded-none " src="@/assets/images/pasta.jpeg" alt="recipe-img">
      <h2 class="text-lg font-semibold">{{recipe.name}}</h2>
      <p>{{ recipe.steps[0] }}</p>
    </figure>
    <navigation-menu />
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

@Component({
  components: {
    NavigationMenu,
    VHeader
  }
})
export default class Recipes extends Vue {
  recipes: Recipe[] = [];
  user: firebase.User | null = null;
  family: Family | null = null;

  async mounted() {
    this.user = await Authentication.getCurrentUser();
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
