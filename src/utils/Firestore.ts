import Family from "@/types/Family";
import Product from "@/types/Product";
import firebase from "firebase";
import WastedProduct from "@/types/WastedProduct";
import Recipe from "@/types/Recipe";
import ShoppingListItem from "@/types/ShoppingListItem";
import Authentication from "@/utils/Authentication";
import DocumentReference = firebase.firestore.DocumentReference;

export default class Firestore {
  public db!: firebase.firestore.Firestore;
  public family: Family | null = null;

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

  public async getRecipesForFamily(): Promise<Recipe[]> {
    const docSnaps = await this.db
      .collection("recipes")
      .where("familyId", "==", (await this.getCurrentFamily())!.id)
      .get();
    return docSnaps.docs.map<Recipe>(doc => doc.data() as Recipe);
  }

  public async createFamily(name: string, members: string[]) {
    const newFamilyRef: DocumentReference = await this.db.collection("family").add({
      members,
      name,
      shoppingList: [],
      storage: []
    });

    await this.db.collection("wasteBuckets").add({
      familyId: newFamilyRef.id,
      wasted: []
    });
  }

  public async getAllProducts(): Promise<Product[]> {
    const querySnap = await this.db.collection("allProducts").get();
    return querySnap.docs.map(doc => doc.data() as Product);
  }

  public async addProductToStorage(product: Product) {
    (await this.getCurrentFamily())!.storage.push(product);
    await this.db
      .collection("family")
      .doc((await this.getCurrentFamily())!.id)
      .set((await this.getCurrentFamily())!);
  }

  public async removeFromStorage(product: Product) {
    const family = (await this.getCurrentFamily())!;

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
      .where("familyId", "==", (await this.getCurrentFamily())!.id)
      .get();
    const wastedProduct: WastedProduct = { ...product, dateWasted: new firebase.firestore.Timestamp(seconds, 0) };
    const bucket = documents.docs[0];
    const updatedWastedList = [...bucket.data().wasted, wastedProduct];

    await this.db
      .collection("wasteBuckets")
      .doc(bucket.id)
      .update("wasted", updatedWastedList);
  }

  public async removeFromShoppingList(product: Product) {
    const family = (await this.getCurrentFamily())!;

    family.shoppingList = family.shoppingList.filter(
      candidate => candidate.name != product.name
    );
    await this.db
      .collection("family")
      .doc(family.id)
      .set(family);
  }

  public async addToShoppingList(product: Product) {
    const family = (await this.getCurrentFamily())!;

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
      .doc((await this.getCurrentFamily())!?.id)
      .update("shoppingList", products);
  }

  public async getCurrentFamily() {
    if (this.family) {
      return this.family
    }

    const user = await Authentication.instance.getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const snap = await this.db
      .collection("family")
      .where("members", "array-contains", user.uid)
      .get();
    if (snap.docs.length === 0) {
      throw new Error(`Family for UID:${user.uid} was not found`);
    }
    return this.family = { id: snap.docs[0].id, ...snap.docs[0].data() } as Family;
  }

  public async getRecipes() {
    const documents = await this.db.collection("recipes").get();
    return documents.docs.map<string>(qds => qds.data().name);
  }

  public async getWastedForFamily() {
    const family = (await this.getCurrentFamily())!;

    const documents = await this.db
      .collection("wasteBuckets")
      .where("familyId", "==", family?.id)
      .get();
    if (documents.docs.length === 0) {
      throw new Error(`WasteBucket for family: ${family?.id} was not found`);
    }

    return documents.docs[0].data().wasted ?? ([] as WastedProduct[]);
  }

  public async getStatisticsForThisMonth(monthData: any) {
    const statistics = this.db
        .collection(`family/${(await this.getCurrentFamily())!.id}/statistics`);
    const thisMonthStatsCollection = await statistics
        .where("month", "==", monthData.month)
        .where("year", "==", monthData.year)
        .get();
    if (thisMonthStatsCollection.docs.length === 0) {
      return {};
    }

    return thisMonthStatsCollection.docs[0].data().totalProducts;
  }

  public async getAvailableMonthData() {
    const monthData: { month: number; year: number; }[] = [];

    const statistics = await this.db
        .collection(`family/${(await this.getCurrentFamily())!.id}/statistics`)
        .get();
    statistics.docs.forEach(stats => {
      monthData.push({ month: stats.data().month, year: stats.data().year });
    });

    return monthData;
  }
}
