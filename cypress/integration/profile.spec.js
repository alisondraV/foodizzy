import { user } from '../fixtures';

describe('Profile Management', () => {
  const updatedUser = {
    name: 'UpdatedPanda',
    email: 'updatedpanda@test.com',
    password: 'pandathebest222',
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

  beforeEach(() => {
    cy.visit('localhost:8080/profile');
  });

  it('can update the name and email of the user', () => {
    cy.get('[data-cy=personal-info]').click();
    cy.get('[data-cy=toggleState]').click();

    cy.get('[type="text"]').clear();
    cy.get('[data-cy=name]').type(updatedUser.name);
    cy.get('[data-cy=email]').type(updatedUser.email);
    cy.get('[data-cy=save]').click();
    cy.wait(500); // wait for information to go through

    cy.visit('localhost:8080/profile');
    cy.contains(updatedUser.name);
    cy.get('[data-cy=personal-info]').click();
    cy.contains(updatedUser.email);
  });

  it('can update password', () => {
    cy.get('[data-cy=password]').click();

    cy.get('[data-cy=current-password]').type(user.password);
    cy.get('[data-cy=new-password]').type(updatedUser.password);
    cy.get('[data-cy=save]').click();
    cy.wait(500); // wait for information to go through

    cy.visit('localhost:8080/profile');
    cy.get('[data-cy=log-out]').click();
    cy.signIn(user.email, updatedUser.password);
    cy.url().should('equal', 'http://localhost:8080/');
  });
});
