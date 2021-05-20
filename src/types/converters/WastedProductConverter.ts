import Converter from './Converter';
import { WastedProduct } from '@/types';
import firebase from 'firebase';

export class WastedProductConverter implements Converter<WastedProduct> {
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): WastedProduct {
    return this.fromData(snapshot.data);
  }

  fromData(data: firebase.firestore.DocumentData) {
    return new WastedProduct(data.name, data.category, data.dateWasted.toDate());
  }

  toFirestore(wastedProduct: WastedProduct) {
    return {
      name: wastedProduct.name,
      category: wastedProduct.category,
      dateWasted: wastedProduct.dateWasted
    };
  }
}
