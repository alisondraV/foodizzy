import admin from 'firebase-admin';
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
  { credential: admin.credential.cert(JSON.stringify(serviceAccountKey)) },
  'prod'
);
const productionDB = productionApp.firestore();

const emulatorApp = firebase.initializeApp(firebaseConfig, 'emulators');
const emulatorDB = emulatorApp.firestore();
emulatorDB.useEmulator('localhost', 8888);

(async function() {
  const allProductsCollectionRef = await emulatorDB
    .collection('allProducts')
    .get();
  console.log(allProductsCollectionRef.docs.map(doc => doc.data()));
})();
