import { productsData } from '../fixtures';

describe('search input', () => {
  const products = productsData.products;

  before(() => {
    cy.clearFirestore();
    cy.clearFirebaseUsers();

    products.forEach(product => {
      cy.callFirestore('set', `allProducts/${product.name}`, product);
    });

    cy.createUser();
    cy.setUpFamily();
    cy.signIn();
  });

  it('shows valid products on search', () => {
    cy.visit('localhost:8080/storage');
    // wait for the page to load
    cy.wait(1000);

    cy.get('[data-cy=search-input').type(products[0].name);

    cy.contains(products[0].category)
      .first()
      .click();
    cy.contains(products[0].name);
  });

  it('clears search on clear button click', () => {
    cy.visit('localhost:8080/storage');
    // wait for the page to load
    cy.wait(1000);

    cy.get('[data-cy=search-input').type('test input');
    cy.contains(products[0].category).should('not.exist');
    cy.get('[data-cy=clear-button').click();

    cy.get('[data-cy=search-input').should('be.empty');
    cy.contains(products[0].category);
  });
});
