import * as admin from 'firebase-admin';
import firebase from 'firebase';
require('dotenv').config();
import serviceAccountKey from './data.json';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
};

const productionApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount)
  },
  'prod'
);
const productionDB = productionApp.firestore();

const emulatorApp = firebase.initializeApp(firebaseConfig, 'emulators2');
const emulatorDB = emulatorApp.firestore();
const emulatorFunctions = emulatorApp.functions();
emulatorFunctions.useEmulator('localhost', 5001);
emulatorDB.useEmulator('localhost', 8888);

(async function() {
  const allProductsCollectionRef = await productionDB
    .collection('allProducts')
    .get();
  const productionData = allProductsCollectionRef.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  const sync = emulatorFunctions.httpsCallable('syncEmulatorAllProducts');
  await sync({ products: productionData });
  emulatorApp.delete();
})();
