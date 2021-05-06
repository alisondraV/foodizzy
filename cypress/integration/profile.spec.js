import { user } from '../fixtures';

describe('Profile Management', () => {
  before(() => {
    cy.clearFirestore();
    cy.clearFirebaseUsers();
    cy.createUser();
    cy.setUpFamily();
    cy.signIn();
    cy.visit('localhost:8080/profile');
  });

  it('finds userName', () => {
    cy.contains(user.name);
  });
});
