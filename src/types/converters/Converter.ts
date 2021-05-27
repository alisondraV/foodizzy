import firebase from 'firebase';

export default interface Converter<T> {
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): T;

  fromData?(data: firebase.firestore.DocumentData);

  toFirestore(object: T);
}
