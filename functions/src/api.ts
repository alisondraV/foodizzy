import * as functions from 'firebase-functions';
import cors from 'cors';
import express from 'express';
import { db } from './utils/admin';

const app = express();

app.use(cors())

app.get('/api/allProducts', async (req, resp) => {
  const allProductsSnap = await db.collection('allProducts').get();
  const allProducts = allProductsSnap.docs.map(doc => doc.data()); 
  
  resp.set('Cache-Control', 'public, max-age=20');

  resp.send(allProducts);
})

export const getAllProducts = functions.https.onRequest(app);
