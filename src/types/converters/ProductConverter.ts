import Converter from './Converter';
import { Product } from '../Product';
import firebase from 'firebase';

export class ProductConverter implements Converter<Product> {
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Product {
    return this.fromData(snapshot.data);
  }

  fromData(data: firebase.firestore.DocumentData) {
    return new Product(data.name, data.category);
  }

  toFirestore(product: Product) {
    return {
      name: product.name,
      category: product.category
    };
  }
}
