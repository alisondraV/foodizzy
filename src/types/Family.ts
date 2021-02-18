import Product from "./Product";
import ShoppingListItem from "./ShoppingListItem";
import Firestore from "@/utils/Firestore";
import Recipe from "@/types/Recipe";
import Authentication from "@/utils/Authentication";
import WastedProduct from "@/types/WastedProduct";

export default interface Family {
  id: string;
  name: string;
  members: string[];
  totalProducts: { [category: string]: number };
  storage: Product[];
  shoppingList: ShoppingListItem[];
}

export class CurrentFamily {
  public family: Family | null = null;

  private static _instance: CurrentFamily | null = null;

  public static get instance(): CurrentFamily {
    if (this._instance === null) {
      this._instance = new CurrentFamily();
    }
    return this._instance;
  }

  public async getCurrentFamily() {
    if (this.family) {
      return this.family;
    }

    const user = await Authentication.instance.getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const snap = await Firestore.instance.db
      .collection("family")
      .where("members", "array-contains", user.email)
      .get();
    if (snap.docs.length === 0) {
      throw new Error(`Family for UID:${user.uid} was not found`);
    }
    return (this.family = {
      id: snap.docs[0].id,
      ...snap.docs[0].data()
    } as Family);
  }

  public async getAvailableMonthData() {
    const family = await this.getCurrentFamily();
    const monthData: { month: number; year: number }[] = [];

    const statistics = await Firestore.instance.db
      .collection(`family/${family.id}/statistics`)
      .get();
    statistics.docs.forEach(stats => {
      monthData.push({ month: stats.data().month, year: stats.data().year });
    });

    return monthData;
  }

  public async getRecipes(): Promise<Recipe[]> {
    const family = await this.getCurrentFamily();

    const docSnaps = await Firestore.instance.db
      .collection("recipes")
      .where("familyId", "==", family.id)
      .get();
    return docSnaps.docs.map<Recipe>(doc => doc.data() as Recipe);
  }

  public async getStatisticsForThisMonth(monthData: {
    month: number;
    year: number;
  }) {
    const family = await this.getCurrentFamily();

    const statistics = Firestore.instance.db.collection(
      `family/${family!.id}/statistics`
    );
    const thisMonthStatsCollection = await statistics
      .where("month", "==", monthData.month)
      .where("year", "==", monthData.year)
      .get();
    if (thisMonthStatsCollection.docs.length === 0) {
      return {};
    }

    return thisMonthStatsCollection.docs[0].data().totalProducts;
  }

  public async getWastedProducts() {
    const family = await this.getCurrentFamily();

    const documents = await Firestore.instance.db
      .collection("wasteBuckets")
      .where("familyId", "==", family?.id)
      .get();
    if (documents.docs.length === 0) {
      throw new Error(`WasteBucket for family: ${family?.id} was not found`);
    }

    return documents.docs[0].data().wasted ?? ([] as WastedProduct[]);
  }
}
