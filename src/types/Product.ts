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

  async removeFromShoppingList() {
    await Firestore.instance.removeFromShoppingList(this);
  }

  async removeFromStorage() {
    await Firestore.instance.removeFromStorage(this);
  }

  async purchase() {
    await this.removeFromShoppingList();
    await Firestore.instance.addProductToStorage(this);
  }

  async consume() {
    await this.removeFromStorage();
    await Firestore.instance.addToShoppingList(this);
  }

  async waste() {
    await Firestore.instance.removeFromStorage(this);
    await Firestore.instance.moveToWasted(this);
  }
}
