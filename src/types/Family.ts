import { AuthorizationError, NotFoundError } from '@/utils/errors';
import { Product, Recipe, WastedProduct } from '@/types';
import { familyConverter, productConverter } from './converters';
import API from '@/utils/API';
import Authentication from '@/utils/Authentication';
import Firestore from '@/utils/Firestore';
import firebase from 'firebase';

import DocumentReference = firebase.firestore.DocumentReference;
import CollectionReference = firebase.firestore.CollectionReference;
import FieldValue = firebase.firestore.FieldValue;
import { PendingMember } from '@/types/PendingMember';

export interface Family {
  id?: string;
  members: string[];
  pendingMembers: PendingMember[];
  name: string;
  storage: Product[];
  shoppingList: Product[];
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

  public get familyCollection(): CollectionReference {
    return Firestore.instance.db.collection('family').withConverter(familyConverter);
  }

  public familyDoc(familyId: string): DocumentReference {
    return this.familyCollection.doc(familyId);
  }

  public async currentFamilyDoc(fresh = false) {
    const family = await this.getCurrentFamily(fresh);
    if (!family.id) {
      throw new Error(`No current family (id: ${family.id})`);
    }
    return this.familyDoc(family.id);
  }

  public async currentStatisticsCollection(): Promise<CollectionReference> {
    const currentFamilyDoc = await this.currentFamilyDoc();
    return currentFamilyDoc.collection('statistics');
  }

  public async create(name: string, members: string[]) {
    const user = await Authentication.instance.getCurrentUser();
    const memberEmailsWithDates = members.map(this.createPendingMember);

    const newFamilyRef: DocumentReference = await Firestore.instance.db.collection('family').add({
      members: [user?.email],
      pendingMembers: memberEmailsWithDates,
      name,
      shoppingList: [],
      storage: []
    });

    await Firestore.instance.db.collection('wasteBuckets').add({
      familyId: newFamilyRef.id,
      wasted: []
    });
  }

  public async update(newFamily: Family) {
    if (!newFamily.id) {
      throw new Error(`Family update failed: Invalid family id (${newFamily.id})`);
    }
    await this.familyDoc(newFamily.id).set(newFamily);
  }

  public async existsFor(user: firebase.User): Promise<boolean> {
    const familiesSnap = await this.familyCollection.where('members', 'array-contains', user.email).get();
    return familiesSnap.docs.length > 0;
  }

  public async getCurrentFamily(fresh = false) {
    if (this.family && !fresh) {
      return this.family;
    }

    const user = await Authentication.instance.getCurrentUser();
    if (!user) {
      throw new AuthorizationError();
    }

    const snap = await this.familyCollection.where('members', 'array-contains', user.email).get();
    if (snap.docs.length === 0) {
      throw new NotFoundError(`Family for UID:${user.uid}`);
    }
    return (this.family = {
      id: snap.docs[0].id,
      ...snap.docs[0].data()
    } as Family);
  }

  public async getAvailableMonthData() {
    const monthData: { month: number; year: number }[] = [];

    const statisticsCollection = await this.currentStatisticsCollection();
    const statistics = await statisticsCollection.get();
    statistics.docs.forEach(stats => {
      monthData.push({ month: stats.data().month, year: stats.data().year });
    });

    return monthData;
  }

  public async getAllProducts() {
    const family = await this.getCurrentFamily();
    return API.instance.getAllProducts(family.id);
  }

  public async saveCustomProduct(product: Product) {
    const currentFamilyDoc = await this.currentFamilyDoc();
    currentFamilyDoc
      .collection('customProducts')
      .withConverter(productConverter)
      .add(product);
  }

  public async getRecipes(): Promise<Recipe[]> {
    const family = await this.getCurrentFamily();

    const docSnaps = await Firestore.instance.db
      .collection('recipes')
      .where('familyId', '==', family.id)
      .get();
    return docSnaps.docs.map<Recipe>(doc => doc.data() as Recipe);
  }

  public async getStatisticsForThisMonth(monthData: { month: number; year: number }) {
    const currentStatisticsCollection = await this.currentStatisticsCollection();
    const thisMonthStatsCollection = await currentStatisticsCollection
      .where('month', '==', monthData.month)
      .where('year', '==', monthData.year)
      .get();
    if (thisMonthStatsCollection.docs.length === 0) {
      return {};
    }

    return thisMonthStatsCollection.docs[0].data().totalProducts;
  }

  public async getOrCreateWasteBucket(): Promise<firebase.firestore.DocumentSnapshot> {
    const family = await this.getCurrentFamily();

    const documents = await Firestore.instance.db
      .collection('wasteBuckets')
      .where('familyId', '==', family?.id)
      .get();
    if (documents.docs.length === 0) {
      const wasteBucketRef = await Firestore.instance.db.collection('wasteBuckets').add({
        familyId: family.id,
        wasted: []
      });
      return wasteBucketRef.get();
    }

    return documents.docs[0].ref.get();
  }

  public async getWastedProducts() {
    const wasteBucket = await this.getOrCreateWasteBucket();
    return wasteBucket.data()?.wasted ?? ([] as WastedProduct[]);
  }

  public async quit() {
    const user = await Authentication.instance.getCurrentUser();
    const currentFamilyDoc = await this.currentFamilyDoc();
    await currentFamilyDoc.update('members', FieldValue.arrayRemove(user!.email));
  }

  public async inviteMembers(memberEmails: string[]) {
    const currentFamilyDoc = await this.currentFamilyDoc();
    const currentPendingMembers = (await currentFamilyDoc.get()).get('pendingMembers') ?? [];
    const currentPendingMembersEmails = currentPendingMembers.map(pendingMember => pendingMember.email);

    const membersToBeInvited = memberEmails.filter(email => !currentPendingMembersEmails.includes(email));
    const memberEmailsWithDates = membersToBeInvited.map(this.createPendingMember);

    await currentFamilyDoc.update('pendingMembers', FieldValue.arrayUnion(...memberEmailsWithDates));
  }

  public async listenForChanges(
    callback?: (snapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) => void
  ) {
    const currentFamilyDoc = await this.currentFamilyDoc(true);
    return currentFamilyDoc.onSnapshot({ next: callback });
  }

  public async switchTo(newFamilyId: string, userEmail: string): Promise<void> {
    const currentFamilyDoc = await this.currentFamilyDoc();
    await currentFamilyDoc.update('members', FieldValue.arrayRemove(userEmail));

    await this.familyDoc(newFamilyId).update('pendingMembers', FieldValue.arrayRemove(userEmail));

    await this.familyDoc(newFamilyId).update('members', FieldValue.arrayUnion(userEmail));
  }

  async cancelInvitation(email: string) {
    const currentFamilyDoc = await this.currentFamilyDoc();
    await currentFamilyDoc.update('pendingMembers', FieldValue.arrayRemove(email));
  }

  async updateFamilyName(newName: string) {
    const currentFamilyDoc = await this.currentFamilyDoc();
    await currentFamilyDoc.update('name', newName);
  }

  private createPendingMember(memberEmail: string) {
    return {
      email: memberEmail,
      date: firebase.firestore.Timestamp.now()
    };
  }
}
