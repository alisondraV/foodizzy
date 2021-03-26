import Firestore from '@/utils/Firestore';
import { ProductDTO } from './DTOs';

export class Product implements ProductDTO {
  public name: string;
  public category?: string | undefined;
  public selected: boolean;

  constructor(name: string, category?: string) {
    this.name = name;
    this.category = category;
    this.selected = false;
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
