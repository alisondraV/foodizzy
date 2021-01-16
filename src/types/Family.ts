import Product from "./Product";
import ShoppingListItem from './ShoppingListItem'

export default interface Family {
    id: string;
    members: string[];
    storage: Product[];
    shoppingList: ShoppingListItem[];
}
