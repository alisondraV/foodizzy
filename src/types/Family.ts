import Product from "./Product";
import ShoppingListItem from './ShoppingListItem'

export default interface Family {
    id: string;
    totalProducts: {[category: string]: number};
    members: string[];
    storage: Product[];
    shoppingList: ShoppingListItem[];
}
