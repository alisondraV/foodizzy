import { Product } from '@/types';
import { ProductDTO } from '@/types/DTOs';
import axios from 'axios';
import firebase from 'firebase';

const httpClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000
});

export default class API {
  private static _instance: API | null = null;
  private functions!: firebase.functions.Functions;

  public static get instance(): API {
    if (this._instance === null) {
      this._instance = new API();
    }
    return this._instance;
  }

  private constructor() {
    this.functions = firebase.functions();

    if (process.env.NODE_ENV === 'development') {
      console.log('Emulator connected');

      this.functions.useEmulator('localhost', 5001);
    }
  }

  public async getAllProducts(familyId?: string): Promise<Product[]> {
    const response = await httpClient.get('/allProducts', { params: { familyId } });
    const allDocs = response.data;
    const allProducts = allDocs.map(doc => Product.fromDTO(doc as ProductDTO));

    return allProducts;
  }
}
