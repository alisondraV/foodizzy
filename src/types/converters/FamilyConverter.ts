import { Family } from '@/types';
import firebase from 'firebase';
import Converter from './Converter';
import { ProductConverter } from './ProductConverter';

export class FamilyConverter implements Converter<Family> {
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Family {
    const data = snapshot.data();
    return data as Family;
  }

  toFirestore(family: Family) {
    const productConverter = new ProductConverter();
    return {
      ...family,
      storage: family.storage.map(product => productConverter.toFirestore(product)),
      shoppingList: family.shoppingList.map(product => productConverter.toFirestore(product))
    };
  }
}
