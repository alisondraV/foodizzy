import productsData from '../fixtures/products.json';
import user from '../fixtures/user.json';

describe('Products', () => {
  const products = productsData.products;

  beforeEach(() => {
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

  it.only('products can be consumed and moved to the shopping list', () => {
    cy.visit('localhost:8080/fridge');

    cy.contains(products[0].category)
      .first()
      .click();
    cy.contains(products[0].name)
      .first()
      .click();
    cy.get('[data-cy=consume]').click();

    // wait for product to be added to the shopping list
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.visit('localhost:8080/shopping-list');
    cy.contains(products[0].category)
      .first()
      .click();
    cy.contains(products[0].name);
  });
});
