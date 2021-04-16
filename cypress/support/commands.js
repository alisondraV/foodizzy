import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);

// Emulate RTDB if Env variable is passed
const rtdbEmulatorHost = Cypress.env('FIREBASE_DATABASE_EMULATOR_HOST');
if (rtdbEmulatorHost) {
  firebaseConfig.databaseURL = `http://${rtdbEmulatorHost}?ns=redux-firebasev3`;
}

firebase.initializeApp(firebaseConfig);

// Emulate Firestore if Env variable is passed
const firestoreEmulatorHost = Cypress.env('FIRESTORE_EMULATOR_HOST');
if (firestoreEmulatorHost) {
  firebase.firestore().settings({
    host: firestoreEmulatorHost,
    ssl: false
  });
}

const authEmulatorHost = Cypress.env('FIREBASE_AUTH_EMULATOR_HOST');
if (authEmulatorHost) {
  firebase.auth().useEmulator(`http://${authEmulatorHost}/`);
  console.debug(`Using Auth emulator: http://${authEmulatorHost}/`);
}

attachCustomCommands({ Cypress, cy, firebase });
