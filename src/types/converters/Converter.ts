import firebase from 'firebase';

export default interface Converter<T> {
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): T;

  toFirestore(object: T);
}
