import Firestore from '@/utils/Firestore';
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
    await Firestore.instance.removeFromList(products, 'shoppingList');
  }

  static async removeAllFromStorage(products: Product[]) {
    await Firestore.instance.removeFromList(products, 'storage');
  }

  static async purchaseAll(products: Product[]) {
    await this.removeAllFromShoppingList(products);
    await Firestore.instance.addToList(products, 'storage');
  }

  static async consumeAll(products: Product[]) {
    await this.removeAllFromStorage(products);
    await Firestore.instance.addToList(products, 'shoppingList');
  }

  static async wasteAll(products: Product[]) {
    await Firestore.instance.removeFromList(products, 'storage');
    await Firestore.instance.moveToWasted(products);
  }
}
