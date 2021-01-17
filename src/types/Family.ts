import Product from "./Product";
import ShoppingListItem from "./ShoppingListItem";

export default interface Family {
  id: string;
  name: string;
  members: string[];
  storage: Product[];
  shoppingList: ShoppingListItem[];
}
