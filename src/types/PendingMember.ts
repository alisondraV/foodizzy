import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface PendingMember {
  email: string;
  date: Timestamp;
}
