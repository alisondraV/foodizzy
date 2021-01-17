import Product from "./Product";
import ShoppingListItem from "./ShoppingListItem";

export default interface Family {
  id: string;
  name: string;
  members: string[];
  totalProducts: {[category: string]: number};
  storage: Product[];
  shoppingList: ShoppingListItem[];
}
