import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const firebaseConfig = {
  apiKey: 'foo',
  projectId: 'foodizzy-app'
};

console.log(firebaseConfig);

firebase.initializeApp(firebaseConfig);

const firestoreEmulatorHost = Cypress.env('FIRESTORE_EMULATOR_HOST');
const authEmulatorHost = Cypress.env('FIREBASE_AUTH_EMULATOR_HOST');

firebase.firestore().settings({
  host: firestoreEmulatorHost,
  ssl: false
});

firebase.auth().useEmulator(`http://${authEmulatorHost}/`);

attachCustomCommands({ Cypress, cy, firebase });
