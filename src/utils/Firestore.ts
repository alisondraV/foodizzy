import firebase from "firebase";
import Family, { CurrentFamily } from "@/types/Family";
import Product from "@/types/Product";
import ShoppingListItem from "@/types/ShoppingListItem";
import WastedProduct from "@/types/WastedProduct";

export default class Firestore {
  public db!: firebase.firestore.Firestore;

  private static _instance: Firestore | null = null;

  public static get instance(): Firestore {
    if (this._instance === null) {
      this._instance = new Firestore();
    }
    return this._instance;
  }

  private constructor() {
    this.db = firebase.firestore();

    if (process.env.NODE_ENV === "development") {
      console.log("Emulator connected");

      this.db.useEmulator("localhost", 8080);
    }
  }

  public async getAllProducts(): Promise<Product[]> {
    const querySnap = await this.db.collection("allProducts").get();
    return querySnap.docs.map(doc => doc.data() as Product);
  }

  public async addProductToStorage(product: Product) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.storage.push(product);
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async removeFromStorage(product: Product) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.storage = family.storage.filter(
      candidate => candidate.name != product.name
    );
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async moveToWasted(product: Product) {
    const seconds = new Date().getTime() / 1000;
    const documents = await this.db
      .collection("wasteBuckets")
      .where(
        "familyId",
        "==",
        (await CurrentFamily.instance.getCurrentFamily())!.id
      )
      .get();
    const wastedProduct: WastedProduct = {
      ...product,
      dateWasted: new firebase.firestore.Timestamp(seconds, 0)
    };
    const bucket = documents.docs[0];
    const updatedWastedList = [...bucket.data().wasted, wastedProduct];

    await this.db
      .collection("wasteBuckets")
      .doc(bucket.id)
      .update("wasted", updatedWastedList);
  }

  public async removeFromShoppingList(product: Product) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.shoppingList = family.shoppingList.filter(
      candidate => candidate.name != product.name
    );
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async addToShoppingList(product: Product) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.shoppingList.push({
      ...product,
      acquired: false
    });
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async updateShoppingList(products: ShoppingListItem[]) {
    await this.db
      .collection("family")
      .doc((await CurrentFamily.instance.getCurrentFamily())!?.id)
      .update("shoppingList", products);
  }

  public async getAllRecipes() {
    const documents = await this.db.collection("recipes").get();
    return documents.docs.map<string>(qds => qds.data().name);
  }

  public async getInvites(userEmail: string): Promise<Family[]> {
    const familyQuerySnap = await this.db
      .collection('family')
      .where('pendingMembers', 'array-contains', userEmail)
      .get();

    return familyQuerySnap.docs.map(snap => snap.data() as Family);
  }
}
