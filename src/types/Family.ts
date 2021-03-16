import firebase from 'firebase';
import Authentication from '@/utils/Authentication';
import DocumentReference = firebase.firestore.DocumentReference;
import Firestore from '@/utils/Firestore';
import Product from './Product';
import Recipe from '@/types/Recipe';
import ShoppingListItem from './ShoppingListItem';
import WastedProduct from '@/types/WastedProduct';
import { AuthorizationError, NotFoundError } from '@/utils/errors';

export default interface Family {
  id?: string;
  members: string[];
  pendingMembers: string[];
  name: string;
  storage: Product[];
  shoppingList: ShoppingListItem[];
  totalProducts: { [category: string]: number };
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

  public async create(name: string, members: string[]) {
    const user = await Authentication.instance.getCurrentUser();
    const newFamilyRef: DocumentReference = await Firestore.instance.db
      .collection('family')
      .add({
        members: [user?.email],
        pendingMembers: members,
        name,
        shoppingList: [],
        storage: []
      });

    await Firestore.instance.db.collection('wasteBuckets').add({
      familyId: newFamilyRef.id,
      wasted: []
    });
  }

  public async existsFor(user: firebase.User): Promise<boolean> {
    const familiesSnap = await Firestore.instance.db
      .collection('family')
      .where('members', 'array-contains', user.email)
      .get();
    return familiesSnap.docs.length > 0;
  }

  public async getCurrentFamily() {
    if (this.family) {
      return this.family;
    }

    const user = await Authentication.instance.getCurrentUser();
    if (!user) {
      throw new AuthorizationError();
    }

    const snap = await Firestore.instance.db
      .collection('family')
      .where('members', 'array-contains', user.email)
      .get();
    if (snap.docs.length === 0) {
      throw new NotFoundError(`Family for UID:${user.uid}`);
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
      .collection('recipes')
      .where('familyId', '==', family.id)
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
      .where('month', '==', monthData.month)
      .where('year', '==', monthData.year)
      .get();
    if (thisMonthStatsCollection.docs.length === 0) {
      return {};
    }

    return thisMonthStatsCollection.docs[0].data().totalProducts;
  }

  public async getWastedProducts() {
    const family = await this.getCurrentFamily();

    const documents = await Firestore.instance.db
      .collection('wasteBuckets')
      .where('familyId', '==', family?.id)
      .get();
    if (documents.docs.length === 0) {
      throw new NotFoundError(`WasteBucket for family: ${family?.id}`);
    }

    return documents.docs[0].data().wasted ?? ([] as WastedProduct[]);
  }

  public async quit() {
    const family = await this.getCurrentFamily();
    const user = await Authentication.instance.getCurrentUser();
    await Firestore.instance.db
      .doc(`family/${family.id}`)
      .update(
        'members',
        firebase.firestore.FieldValue.arrayRemove(user!.email)
      );
  }

  public async inviteMembers(memberEmails: string[]) {
    const family = await this.getCurrentFamily();
    await Firestore.instance.db
      .doc(`family/${family.id}`)
      .update(
        'pendingMembers',
        firebase.firestore.FieldValue.arrayUnion(...memberEmails)
      );
  }

  public async listenForChanges(
    callback: (
      snapshot: firebase.firestore.DocumentSnapshot<
        firebase.firestore.DocumentData
      >
    ) => void
  ) {
    const family = await this.getCurrentFamily();
    Firestore.instance.db
      .doc(`family/${family.id}`)
      .onSnapshot({ next: callback });
  }

  public async switchTo(newFamilyId: string, userEmail: string): Promise<void> {
    try {
      const family = await this.getCurrentFamily();
      await Firestore.instance.db
        .doc(`family/${family.id}`)
        .update(
          'members',
          firebase.firestore.FieldValue.arrayRemove(userEmail)
        );
    } catch (e) {
      console.log(e.message);
    }

    await Firestore.instance.db
      .doc(`family/${newFamilyId}`)
      .update(
        'pendingMembers',
        firebase.firestore.FieldValue.arrayRemove(userEmail)
      );

    await Firestore.instance.db
      .doc(`family/${newFamilyId}`)
      .update('members', firebase.firestore.FieldValue.arrayUnion(userEmail));
  }
}
