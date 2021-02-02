import Product from "./Product";
import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

export default interface WastedProduct extends Product {
  dateWasted: Timestamp;
}
