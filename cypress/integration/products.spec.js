import productsData from '../fixtures/products.json';

describe('Products', () => {
  const products = productsData.products;

  it('test', () => {
    cy.visit('localhost:8080/fridge-setup');
  });

  it.only('products can be consumed and move to the shopping list', () => {
    cy.visit('localhost:8080/fridge');

    cy.contains(products[0].category)
      .first()
      .click();
    cy.contains(products[0].name)
      .first()
      .click();
    cy.get('[data-cy=consume]').click();

    cy.visit('localhost:8080/shopping-list');
    cy.contains(products[0].category)
      .first()
      .click();
    cy.contains(products[0].name);
  });
});
