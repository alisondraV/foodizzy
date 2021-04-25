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

  it('signs the user up', () => {
    signUp();

    cy.url().should('include', '/onboarding-track-waste');
  });

  it('sets up the fridge', () => {
    signUp();
    setUpFamily();

    cy.url().should('equal', 'http://localhost:8080/');
  });

  it('signs the user in', () => {
    signUp();
    setUpFamily();

    cy.get('[data-cy=profile-button]').click();

    cy.get('[data-cy=log-out]').click();

    cy.visit('localhost:8080/sign-in');

    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=password]').type(user.password);
    cy.get('[data-cy=sign-in]').click();

    cy.url().should('equal', 'http://localhost:8080/');
  });
});
