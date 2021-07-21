import { user } from '../fixtures';
import { PathName } from '@/utils/enums';

describe('Profile Management', () => {
  const updatedUser = {
    name: 'UpdatedPanda',
    email: 'updatedpanda@test.com',
    password: 'pandathebest222',
    familyName: 'PandasBigFamily'
  };

  beforeEach(() => {
    cy.clearFirestore();
    cy.clearFirebaseUsers();
    cy.createUser();
    cy.setUpFamily();
    cy.signIn();
    // wait for successful sign in
    cy.wait(500);
    cy.visit(`localhost:8080${PathName.UserProfile}`);
    // wait for family data to load
    cy.wait(1000);
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

    cy.contains(updatedUser.email);
    cy.get('[data-cy=close]').click();

    cy.contains(updatedUser.name);
  });

  it('can update password', () => {
    cy.get('[data-cy=password]').click();

    cy.get('[data-cy=current-password]').type(user.password);
    cy.get('[data-cy=new-password]').type(updatedUser.password);
    cy.get('[data-cy=save]').click();
    cy.get('[data-cy=close]').click();

    cy.get('[data-cy=log-out]').click();

    cy.signIn(user.email, updatedUser.password);
    cy.url().should('equal', `http://localhost:8080${PathName.Storage}`);
    cy.signOut();
  });

  it('can update the family name, tweak pending members and display family members', () => {
    cy.get('[data-cy=family]').click();
    cy.get('[data-cy=edit]').click();

    // wait for the page to load
    cy.wait(2000);
    cy.contains(user.name);
    cy.contains(user.newFamilyMembers[0]);
    cy.get('[data-cy=cancel-invite]').click();
    cy.contains('No pending invitations');

    cy.get('[type="text"]').clear();
    cy.get('[data-cy=new-name]').type(updatedUser.familyName);
    cy.get('[data-cy=save]').click();
    cy.get('[data-cy=close]').click();

    cy.get('[data-cy=family]').click();
    cy.contains(updatedUser.familyName);
    cy.contains(user.familyName).should('not.exist');
  });
});
