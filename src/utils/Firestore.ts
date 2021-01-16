import firebase from "firebase";

export default class Firestore {
  public db!: firebase.firestore.Firestore;

  private static _instance: Firestore | null = null;

  public static get instance(): Firestore {
    if (this._instance === null) {
      this._instance = new Firestore();
    }
    return this._instance;
  }
}
