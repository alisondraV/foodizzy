import { RecipeIngredient } from '.';

export interface Recipe {
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
}
