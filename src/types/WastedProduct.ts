import { ProductDTO } from './DTOs';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export default interface WastedProduct extends ProductDTO {
  dateWasted: Timestamp;
}
