import { Product } from '.';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class WastedProduct extends Product {
  public dateWasted?: Timestamp;

  constructor(name: string, dateWasted: Timestamp, category?: string, selected?: boolean) {
    super(name, category, selected);
    this.dateWasted = dateWasted;
  }
}
