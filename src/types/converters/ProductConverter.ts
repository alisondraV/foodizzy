import Converter from './Converter';
import { Product } from '@/types';
import firebase from 'firebase';

export const productConverter: Converter<Product> = {
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Product {
    return this.fromData!(snapshot.data);
  },
  fromData(data: firebase.firestore.DocumentData) {
    return new Product(data.name, data.category);
  },
  toFirestore(product: Product) {
    return {
      name: product.name,
      category: product.category
    };
  }
};
