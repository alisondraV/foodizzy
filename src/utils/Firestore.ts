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

  public async getProducts() {
    const documents = await Firestore.instance.db.collection("products").get();
    return documents.docs.map<string>(qds => qds.data().name);
  }
  public async getRecipes() {
    const documents = await Firestore.instance.db.collection("recipes").get();
    return documents.docs.map<string>(qds => qds.data().name);
  }
}
