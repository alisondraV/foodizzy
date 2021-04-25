import productsData from '../fixtures/products.json';
import user from '../fixtures/user.json';

describe('product CRUD', () => {
  const products = productsData.products;

  function visitFridgeAndSelectAProduct(index) {
    cy.visit('localhost:8080/fridge');

    cy.contains(products[index].category)
      .first()
      .click();
    cy.contains(products[index].name)
      .first()
      .click();
  }

  before(() => {
    cy.clearFirestore();
    cy.clearFirebaseUsers();

    products.forEach(product => {
      cy.callFirestore('set', `allProducts/${product.name}`, product);
    });

    cy.request('POST', 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=foo', {
      email: user.email,
      password: user.password
    });

    cy.callFirestore('set', 'family/MyFamily', {
      members: [user.email],
      pendingMembers: [],
      storage: products,
      shoppingList: []
    });

    cy.visit('localhost:8080/sign-in');

    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=password]').type(user.password);
    cy.get('[data-cy=sign-in]').click();
  });

  it('can consume product from storage', () => {
    visitFridgeAndSelectAProduct(0);

    cy.get('[data-cy=consume]').click();
    // wait for product to be added to the shopping list
    cy.wait(1000);

    cy.visit('localhost:8080/shopping-list');
    cy.contains(products[0].category)
      .first()
      .click();
    cy.contains(products[0].name).should('exist');
  });

  it.only('can delete product from storage', () => {
    visitFridgeAndSelectAProduct(1);

    cy.get('[data-cy=remove]').click();
    // wait for product to be added to the shopping list
    cy.wait(1000);

    cy.contains(products[1].category).should('not.exist');
  });

  it.skip('can waste product from storage', () => {});
});
