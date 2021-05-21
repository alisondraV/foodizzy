import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';
import { user, productsData } from '../fixtures';

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

Cypress.Commands.add('createUser', (email = user.email, password = user.password, name = user.name) => {
  cy.request('POST', 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=foo', {
    email,
    password,
    displayName: name
  }); 
});

Cypress.Commands.add('setUpFamily', () => {
  const products = productsData.products;

  cy.callFirestore('set', 'family/MyFamily', {
    id: 'MyFamily',
    name: user.familyName,
    members: [user.email],
    pendingMembers: [user.newFamilyMembers[0]],
    storage: [],
    shoppingList: []
  });
  cy.callFirestore('update', 'family/MyFamily', {
    storage: products
  });
});

Cypress.Commands.add('signIn', (email = user.email, password = user.password) => {
  cy.visit('localhost:8080/sign-in');

  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=sign-in]').click();
});
