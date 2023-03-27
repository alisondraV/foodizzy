<template>
  <div>
    <v-header heading="Recipes" />
    <div class="mt-20 mb-20 mx-8">
      <div v-if="recipes.length !== 0">
        <figure class="m-10 rounded" v-for="recipe in recipes" :key="recipe.name">
          <recipe-component :recipe="recipe" />
        </figure>
      </div>
      <div v-else class="flex flex-col items-center text-primary-text text-center">
        <img src="@/assets/images/DefaultRecipes.svg" alt="Recipes" class="mb-4 mt-4" />
        <h1 class="text-header-onboarding font-extrabold mb-3">
          This feature is in progress
        </h1>
        <p class="mb-8">
          We haven’t implemented this feature yet. Please, come back later.
        </p>
      </div>
    </div>
    <navigation-menu />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CurrentFamily, Recipe } from '@/types';
import { NavigationMenu, RecipeComponent, VHeader } from '@/components';

const recipes = ref<Recipe[]>([]);

onMounted(async () => {
  recipes.value = await CurrentFamily.instance.getRecipes();
});
</script>
