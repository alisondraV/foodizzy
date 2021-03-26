import Firestore from '@/utils/Firestore';
import { ProductDTO } from './DTOs';

export class Product implements ProductDTO {
  public name: string;
  private _category?: string | undefined;
  public static defaultCategory = 'General';
  public selected: boolean;

  constructor(name: string, category?: string) {
    this.name = name;
    this._category = category;
    this.selected = false;
  }

  get category() {
    return this._category ?? Product.defaultCategory;
  }

  static fromDTO(product: ProductDTO) {
    return new Product(product.name, product.category);
  }

  async delete() {
    await Firestore.instance.removeFromStorage(this);
  }

  async consume() {
    await Firestore.instance.removeFromStorage(this);
    await Firestore.instance.addToShoppingList(this);
  }

  async waste() {
    await Firestore.instance.removeFromStorage(this);
    await Firestore.instance.moveToWasted(this);
    await Firestore.instance.addToShoppingList(this);
  }
}
