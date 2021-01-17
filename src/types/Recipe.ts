import RecipeIngredient from "./RecipeIngredient";

export default interface Recipe {
  name: string;
  ingredients: RecipeIngredient[];
  steps: string[];
}
