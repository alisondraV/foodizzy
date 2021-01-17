import Family from "@/types/Family";
import Product from "@/types/Product";
import firebase from "firebase";
import WastedProduct from "@/types/WastedProduct";
import ShoppingListItem from "@/types/ShoppingListItem";

export default class Firestore {
  public db!: firebase.firestore.Firestore;
  
  private static _instance: Firestore | null = null;
  
  public static get instance(): Firestore {
    if (this._instance === null) {
      this._instance = new Firestore();
    }
    return this._instance;
  }

  public async createFamily(name: string, members: string[]) {
    await this.db.collection('family').add({
      members,
      name,
      shoppingList: [],
      storage:[],
      totalProducts: {}
    })
  }

  public async getAllProducts(): Promise<Product[]> {
    const querySnap = await this.db.collection("allProducts").get();
    return querySnap.docs.map(doc => doc.data() as Product);
  }

  public async addProductToStorage(family: Family | null, product: Product) {
    if (!family) {
      throw new Error("No family supplied");
    }
    family.storage.push(product);
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async removeFromStorage(family: Family | null, product: Product) {
    if (!family) {
      throw new Error("No family supplied");
    }
    family.storage = family.storage.filter(
      candidate => candidate.name != product.name
    );
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async moveToWasted(family: Family | null, product: Product) {
    if (!family) {
      throw new Error("No family supplied");
    }

    const documents = await this.db
      .collection("wasteBuckets")
      .where("familyId", "==", family?.id)
      .get();
    const wastedProduct: WastedProduct = { ...product, dateWasted: new Date() };
    const bucket = documents.docs[0];
    const updatedWastedList = [...bucket.data().wasted, wastedProduct];

    await this.db
      .collection("wasteBuckets")
      .doc(bucket.id)
      .update("wasted", updatedWastedList);
  }

  public async removeFromShoppingList(family: Family | null, product: Product) {
    if (!family) {
      throw new Error("No family supplied");
    }
    family.shoppingList = family.shoppingList.filter(
      candidate => candidate.name != product.name
    );
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async addToShoppingList(family: Family | null, product: Product) {
    if (!family) {
      throw new Error("No family supplied");
    }
    family.shoppingList.push({
      name: product.name,
      acquired: false
    });
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async updateShoppingList(family: Family|null, products: ShoppingListItem[]) {
    await this.db.collection('family').doc(family?.id).update('shoppingList', products)
  }

  public async getFamilyForUser(user: firebase.User) {
    const snap = await this.db
      .collection("family")
      .where("members", "array-contains", user.uid)
      .get();
    if (snap.docs.length === 0) {
      throw new Error(`Family for UID:${user.uid} was not found`);
    }
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Family;
  }

  public async getRecipes() {
    const documents = await this.db.collection("recipes").get();
    return documents.docs.map<string>(qds => qds.data().name);
  }

  public async getWastedForFamily(family: Family | null) {
    const documents = await this.db
      .collection("wasteBuckets")
      .where("familyId", "==", family?.id)
      .get();
    if (documents.docs.length === 0) {
      throw new Error(`WasteBucket for family: ${family?.id} was not found`);
    }
    return documents.docs[0].data().wasted as WastedProduct[];
  }
}
