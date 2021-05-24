import Firestore from '@/utils/Firestore';
import { ListName } from '@/utils/enums';

export class Product {
  public name: string;
  private _category?: string | undefined;
  public static defaultCategory = 'General';
  public selected: boolean;

  constructor(name: string, category?: string, selected?: boolean) {
    this.name = name;
    this._category = category;
    this.selected = selected ?? false;
  }

  get category() {
    return this._category ?? Product.defaultCategory;
  }

  set category(value) {
    this._category = value;
  }

  static async removeAllFromShoppingList(products: Product[]) {
    await Firestore.instance.removeFromList(products, ListName.ShoppingList);
  }

  static async removeAllFromStorage(products: Product[]) {
    await Firestore.instance.removeFromList(products, ListName.Storage);
  }

  static async purchaseAll(products: Product[]) {
    await this.removeAllFromShoppingList(products);
    await Firestore.instance.addToList(products, ListName.Storage);
  }

  static async consumeAll(products: Product[]) {
    await this.removeAllFromStorage(products);
    await Firestore.instance.addToList(products, ListName.ShoppingList);
  }

  static async wasteAll(products: Product[]) {
    await Firestore.instance.removeFromList(products, ListName.Storage);
    await Firestore.instance.moveToWasted(products);
  }
}
