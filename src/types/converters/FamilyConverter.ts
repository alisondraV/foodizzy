import Converter from './Converter';
import { Family } from '@/types';
import { ProductConverter } from './ProductConverter';
import firebase from 'firebase';

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
