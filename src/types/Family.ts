import IProduct from "./Product";
import IShoppingListItem from './ShoppingListItem'

export default interface IFamily {
    id: string;
    members: string[];
    storage: IProduct[];
    shoppingList: IShoppingListItem[];
}
