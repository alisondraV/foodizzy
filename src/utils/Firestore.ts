import Family from "@/types/Family";
import Product from "@/types/Product";
import firebase from "firebase";
import WastedProduct from "@/types/WastedProduct";
import Recipe from "@/types/Recipe";
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

  constructor() {
    this.db = firebase.firestore();

    if (process.env.NODE_ENV === "development") {
      console.log("Emulator connected");

      this.db.useEmulator("localhost", 8080);
    }
  }

  public async getRecipesForFamily(family: Family): Promise<Recipe[]> {
    const docSnaps = await this.db
      .collection("recipes")
      .where("familyId", "==", family.id)
      .get();
    return docSnaps.docs.map<Recipe>(doc => doc.data() as Recipe);
  }

  public async createFamily(name: string, members: string[]) {
    const newFamily = await this.db.collection("family").add({
      members,
      name,
      shoppingList: [],
      storage: [],
      totalProducts: {}
    });

    await this.db.collection("wasteBuckets").add({
      familyId: newFamily.id,
      wasted: []
    });
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

    const seconds = new Date().getTime() / 1000;
    const documents = await this.db
      .collection("wasteBuckets")
      .where("familyId", "==", family?.id)
      .get();
    const wastedProduct: WastedProduct = { ...product, dateWasted: new firebase.firestore.Timestamp(seconds, 0) };
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
      ...product,
      acquired: false
    });
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async updateShoppingList(
    family: Family | null,
    products: ShoppingListItem[]
  ) {
    await this.db
      .collection("family")
      .doc(family?.id)
      .update("shoppingList", products);
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

    return documents.docs[0].data().wasted ?? ([] as WastedProduct[]);
  }
}
