import IFamily from "@/types/Family";
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

  public async getFamilyForUser(user: firebase.User) {
    const snap = await this.db
      .collection("family")
      .where("members", "array-contains", user.uid)
      .get();
    if (snap.docs.length === 0) {
      throw new Error(`Family for UID:${user.uid} was not found`);
    }
    return snap.docs[0].data() as IFamily;
  }

  public async getProducts() {
    const documents = await this.db.collection("products").get();
    return documents.docs.map<string>(qds => qds.data().name);
  }

  public async getRecipes() {
    const documents = await this.db.collection("recipes").get();
    return documents.docs.map<string>(qds => qds.data().name);
  }
}
