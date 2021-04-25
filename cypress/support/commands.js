import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const firebaseConfig = {
  apiKey: 'foo',
  projectId: 'foodizzy-app'
};

firebase.initializeApp(firebaseConfig);

const firestoreEmulatorHost = Cypress.env('FIRESTORE_EMULATOR_HOST');
const authEmulatorHost = Cypress.env('FIREBASE_AUTH_EMULATOR_HOST');

firebase.firestore().settings({
  host: firestoreEmulatorHost,
  ssl: false
});

firebase.auth().useEmulator(`http://${authEmulatorHost}/`);

attachCustomCommands({ Cypress, cy, firebase });

Cypress.Commands.add('clearFirestore', () => {
  cy.request(
    'DELETE',
    'http://localhost:8888/emulator/v1/projects/foodizzy-app/databases/(default)/documents'
  );
});

Cypress.Commands.add('clearFirebaseUsers', () => {
  cy.request('DELETE', 'http://localhost:9099/emulator/v1/projects/foodizzy-app/accounts');
});
