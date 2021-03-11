<template>
  <div>
    <img
      class="h-40 w-full object-cover rounded-md mb-4"
      src="@/assets/images/Pasta.jpg"
      alt="recipe-img"
    />
    <h2 class="text-lg font-semibold mb-2 text-primary-text">
      {{ recipe.name }}
    </h2>
    <p class="text-secondary-text mb-4">{{ recipe.steps[0] }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Recipe from '@/types/Recipe';

@Component
export default class RecipeComponent extends Vue {
  @Prop() recipe!: Recipe;
}
</script>
