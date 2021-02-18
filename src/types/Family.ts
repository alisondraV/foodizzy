import Product from "./Product";
import ShoppingListItem from "./ShoppingListItem";
import Firestore from "@/utils/Firestore";
import Recipe from "@/types/Recipe";
import Authentication from "@/utils/Authentication";

export default interface Family {
  id: string;
  name: string;
  members: string[];
  totalProducts: { [category: string]: number };
  storage: Product[];
  shoppingList: ShoppingListItem[];
}

export class CurrentFamily {
  private family: Family | null = null;
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

  public async getRecipes(): Promise<Recipe[]> {
    const docSnaps = await Firestore.instance.db
      .collection("recipes")
      .where("familyId", "==", (await this.getCurrentFamily())!.id)
      .get();
    return docSnaps.docs.map<Recipe>(doc => doc.data() as Recipe);
  }
}
