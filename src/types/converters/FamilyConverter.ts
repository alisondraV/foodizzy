import Converter from './Converter';
import { Family } from '@/types';
import firebase from 'firebase';
import { productConverter } from './ProductConverter';

export const familyConverter: Converter<Family> = {
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Family {
    const data = snapshot.data();
    return data as Family;
  },
  toFirestore(family: Family) {
    return {
      ...family,
      storage: family.storage.map(productConverter.toFirestore),
      shoppingList: family.shoppingList.map(productConverter.toFirestore)
    };
  }
};
