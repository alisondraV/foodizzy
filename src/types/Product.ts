import Firestore from '@/utils/Firestore';
import { ProductDTO } from './DTOs';

export class Product implements ProductDTO {
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

  static fromDTO(product: ProductDTO) {
    return new Product(product.name, product.category);
  }

  toDTO() {
    return {
      name: this.name,
      category: this.category
    };
  }

  static async removeAllFromShoppingList(products: Product[]) {
    await Firestore.instance.removeFromShoppingList(products);
  }

  static async removeAllFromStorage(products: Product[]) {
    await Firestore.instance.removeFromStorage(products);
  }

  static async purchaseAll(products: Product[]) {
    await this.removeAllFromShoppingList(products);
    await Firestore.instance.addToStorage(products);
  }

  static async consumeAll(products: Product[]) {
    await this.removeAllFromStorage(products);
    await Firestore.instance.addToShoppingList(products);
  }

  static async wasteAll(products: Product[]) {
    await Firestore.instance.removeFromStorage(products);
    await Firestore.instance.moveToWasted(products);
  }
}
