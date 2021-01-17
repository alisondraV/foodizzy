import Product from "@/types/Product";

export default interface ShoppingListItem extends Product {
  acquired: boolean;
}
