import user from '../fixtures/user.json';
import productsData from '../fixtures/products.json';

describe('Authentication', () => {
  const products = productsData.products;

  function signUp() {
    cy.visit('localhost:8080/sign-up');

    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=name]').type(user.name);
    cy.get('[data-cy=password]').type(user.password);
    cy.get('[data-cy=sign-up]').click();
  }

  function setUpFamily() {
    cy.contains('Skip')
      .first()
      .click();
    cy.url().should('include', '/create-family');

    cy.get('[data-cy=name]').type(user.familyName);
    cy.get('[data-cy=member-email]').type(user.newFamilyMembers[0]);
    cy.get('[data-cy=add-member]').click();
    cy.get('[data-cy=create]').click();

    cy.url().should('include', '/fridge-setup');

    products.forEach(product =>
      cy
        .contains(product.name)
        .first()
        .click({ force: true })
    );
    cy.get('[data-cy=add-products]').click();
  }

  beforeEach(() => {
    cy.clearFirestore();
    cy.clearFirebaseUsers();

    products.forEach(product => {
      cy.callFirestore('set', `allProducts/${product.name}`, product);
    });
  });

  it.skip('shows onboarding when user signs up with Google from SignIn page', () => {
    cy.visit('localhost:8080/sign-in');
    cy.get('[data-cy=google-sign-in]').click();

    // cy.window().then(win => {
    //   console.log(win.window.location);
    //   win
    //     .contains('Add new account')
    //     .first()
    //     .click();
    // cy.contains('Auto-generate user information')
    //   .first()
    //   .click();
    // cy.contains('Sign in with')
    //   .first()
    //   .click();
    // });

    cy.wait(5000);
    cy.url().should('include', '/onboarding-track-waste');
  });

  it('signs the user up => sets up the family => logs out => signs in with the existing user', () => {
    signUp();
    cy.url().should('include', '/onboarding-track-waste');

    setUpFamily();
    cy.url().should('equal', 'http://localhost:8080/');

    cy.callFirestore('get', '/family').then(response => {
      cy.wrap(response[0])
        .its('pendingMembers')
        .should('contain', user.newFamilyMembers[0]);
      cy.wrap(response[0])
        .its('members')
        .should('contain', user.email);
    });

    cy.get('[data-cy=profile-button]').click();
    cy.get('[data-cy=log-out]').click();

    cy.visit('localhost:8080/sign-in');

    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=password]').type(user.password);
    cy.get('[data-cy=sign-in]').click();

    cy.url().should('equal', 'http://localhost:8080/');
  });
});
