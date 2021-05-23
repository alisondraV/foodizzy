import 'firebase/functions';
import { CurrentFamily, Family, Product, WastedProduct } from '@/types';
import { productConverter, wastedProductConverter } from '@/types/converters';
import { CallableFunctions } from './enums';
import { ListName } from './consts';
import firebase from 'firebase';

import FieldValue = firebase.firestore.FieldValue;

export default class Firestore {
  public db!: firebase.firestore.Firestore;
  private functions!: firebase.functions.Functions;
  private static _instance: Firestore | null = null;

  public static get instance(): Firestore {
    if (this._instance === null) {
      this._instance = new Firestore();
    }
    return this._instance;
  }

  private constructor() {
    this.functions = firebase.functions();
    this.db = firebase.firestore();

    if (process.env.NODE_ENV === 'development') {
      console.log('Emulator connected');

      this.db.useEmulator('localhost', 8888);
      this.functions.useEmulator('localhost', 5001);

      // eslint-disable-next-line max-len
      // this is needed for Firestore to work with Cypress (https://github.com/cypress-io/cypress/issues/6350#issuecomment-821916119)
      this.db.settings({
        experimentalForceLongPolling: true,
        merge: true
      });
    }
  }

  public async getUsersByEmail(emails: string[]) {
    const getUsersByEmailFunction = this.functions.httpsCallable(CallableFunctions.GetUsersByEmail);
    const response = await getUsersByEmailFunction({ emails });
    return response.data;
  }

  public async addToList(products: Product[], listName: ListName) {
    const currentFamilyDoc = await CurrentFamily.instance.currentFamilyDoc();

    await currentFamilyDoc.update(
      listName,
      FieldValue.arrayUnion(...products.map(productConverter.toFirestore))
    );
  }

  public async removeFromList(products: Product[], listName: ListName) {
    const currentFamilyDoc = await CurrentFamily.instance.currentFamilyDoc();

    await currentFamilyDoc.update(
      listName,
      FieldValue.arrayRemove(...products.map(productConverter.toFirestore))
    );
  }

  public async moveToWasted(products: Product[]) {
    const wastedProducts: WastedProduct[] = products.map(
      product => new WastedProduct(product.name, firebase.firestore.Timestamp.now(), product.category)
    );
    const bucket = await CurrentFamily.instance.getOrCreateWasteBucket();

    await bucket.ref.update(
      'wasted',
      FieldValue.arrayUnion(...wastedProducts.map(wastedProductConverter.toFirestore))
    );
  }

  public async updateShoppingList(products: Product[]) {
    const currentFamilyDoc = await CurrentFamily.instance.currentFamilyDoc();
    await currentFamilyDoc.update('shoppingList', products);
  }

  public async getAllRecipes() {
    const documents = await this.db.collection('recipes').get();
    return documents.docs.map<string>(qds => qds.data().name);
  }

  public async getInvitations(userEmail: string): Promise<Family[]> {
    const familyQuerySnap = await CurrentFamily.instance.familyCollection
      .where('pendingMembers', 'array-contains', userEmail)
      .get();

    return familyQuerySnap.docs.map(snap => snap.data() as Family);
  }

  public async declineInvitation(familyId: string, userEmail: string) {
    const familyRef = this.db.collection('family').doc(familyId);

    await familyRef.update('pendingMembers', firebase.firestore.FieldValue.arrayRemove(userEmail));
  }

  public async isProductInStorage(product: Product) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    const storageProductNames = family.storage.map(p => p.name);

    return storageProductNames?.includes(product.name);
  }

  public async isProductInShoppingList(product: Product) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    const shoppingListProductNames = family.shoppingList.map(p => p.name);
    return shoppingListProductNames?.includes(product.name);
  }
}
