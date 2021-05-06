import { user } from '../fixtures';

describe('Profile Management', () => {
  const updatedUser = {
    name: 'UpdatedPanda',
    email: 'updatedpanda@test.com',
    familyName: 'BigPandasFam'
  };

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

  it('can update the name and email of the user', () => {
    cy.get('[data-cy=personal-info]').click();
    cy.get('[data-cy=toggleState]').click();

    cy.get('[type="text"]').clear();
    cy.get('[data-cy=name]').type(updatedUser.name);
    cy.get('[data-cy=email]').type(updatedUser.email);
    cy.get('[data-cy=save]').click();
    cy.wait(500);

    cy.visit('localhost:8080/profile');
    cy.contains(updatedUser.name);
    cy.get('[data-cy=personal-info]').click();
    cy.contains(updatedUser.email);
  });
});
