import firebase from 'firebase';
import 'firebase/functions';
import { CurrentFamily, Family, Product } from '@/types';
import { ProductDTO } from '@/types/DTOs';
import WastedProduct from '@/types/WastedProduct';
import { CallableFunctions } from './consts';

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
    }
  }

  public async getUsersByEmail(emails: string[]) {
    const getUsersByEmailFunction = this.functions.httpsCallable(CallableFunctions.GetUsersByEmail);
    const response = await getUsersByEmailFunction({ emails });
    return response.data;
  }

  public async getAllProducts(): Promise<Product[]> {
    const querySnap = await this.db.collection('allProducts').get();
    return querySnap.docs.map(doc => Product.fromDTO(doc.data() as ProductDTO));
  }

  public async addProductToStorage(product: ProductDTO) {
    if (product instanceof Product) {
      product = product.toDTO();
    }

    if (await this.isProductInStorage(product)) return;
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.storage.push(product);
    await this.db
      .collection('family')
      .doc(family.id)
      .set(family);
  }

  public async removeFromStorage(product: ProductDTO) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.storage = family.storage.filter(candidate => candidate.name != product.name);
    await this.db
      .collection('family')
      .doc(family.id)
      .set(family);
  }

  public async moveToWasted(product: ProductDTO) {
    if (product instanceof Product) {
      product = product.toDTO();
    }
    const seconds = new Date().getTime() / 1000;
    const documents = await this.db
      .collection('wasteBuckets')
      .where('familyId', '==', (await CurrentFamily.instance.getCurrentFamily())!.id)
      .get();
    const wastedProduct: WastedProduct = {
      ...product,
      dateWasted: new firebase.firestore.Timestamp(seconds, 0)
    };
    const bucket = documents.docs[0];
    const updatedWastedList = [...bucket.data().wasted, wastedProduct];

    await this.db
      .collection('wasteBuckets')
      .doc(bucket.id)
      .update('wasted', updatedWastedList);
  }

  public async removeFromShoppingList(product: ProductDTO) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.shoppingList = family.shoppingList.filter(candidate => candidate.name != product.name);
    await this.db
      .collection('family')
      .doc(family.id)
      .set(family);
  }

  public async addToShoppingList(product: ProductDTO) {
    if (product instanceof Product) {
      product = product.toDTO();
    }
    if (await this.isProductInShoppingList(product)) return;
    const family = await CurrentFamily.instance.getCurrentFamily();

    family.shoppingList.push(product);
    await this.db
      .collection('family')
      .doc(family.id)
      .set(family);
  }

  public async updateShoppingList(products: Product[]) {
    await this.db
      .collection('family')
      .doc((await CurrentFamily.instance.getCurrentFamily())!?.id)
      .update('shoppingList', products);
  }

  public async getAllRecipes() {
    const documents = await this.db.collection('recipes').get();
    return documents.docs.map<string>(qds => qds.data().name);
  }

  public async getInvitations(userEmail: string): Promise<Family[]> {
    const familyQuerySnap = await this.db
      .collection('family')
      .where('pendingMembers', 'array-contains', userEmail)
      .get();

    return familyQuerySnap.docs.map(snap => snap.data() as Family);
  }

  public async declineInvitation(familyId: string, userEmail: string) {
    const familyRef = this.db.collection('family').doc(familyId);

    await familyRef.update('pendingMembers', firebase.firestore.FieldValue.arrayRemove(userEmail));
  }

  public async isProductInStorage(product: ProductDTO) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    const storageProductNames = family.storage.map(p => p.name);
    return storageProductNames?.includes(product.name);
  }

  public async isProductInShoppingList(product: ProductDTO) {
    const family = await CurrentFamily.instance.getCurrentFamily();

    const shoppingListProductNames = family.shoppingList.map(p => p.name);
    return shoppingListProductNames?.includes(product.name);
  }
}
