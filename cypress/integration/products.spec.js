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
      id: 'MyFamily',
      members: [user.email],
      pendingMembers: [],
      storage: [],
      shoppingList: []
    });
    cy.callFirestore('update', 'family/MyFamily', {
      storage: products
    });

    cy.visit('localhost:8080/sign-in');

    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=password]').type(user.password);
    cy.get('[data-cy=sign-in]').click();
  });

  describe('moving products around', () => {
    it('can consume product from storage', () => {
      visitFridgeAndSelectAProduct(0);

      cy.get('[data-cy=consume]').click();
      // wait for product to be added to the shopping list
      cy.wait(1000);
      cy.contains(products[0].category).should('not.exist');

      cy.visit('localhost:8080/shopping-list');
      cy.contains(products[0].category)
        .first()
        .click();
      cy.contains(products[0].name).should('exist');
    });

    it('can delete product from storage', () => {
      visitFridgeAndSelectAProduct(1);

      cy.get('[data-cy=remove]').click();
      // wait for product to be added to the shopping list
      cy.wait(1000);

      cy.contains(products[1].category).should('not.exist');
      cy.contains(products[1].name).should('not.exist');
    });

    it('can waste product from storage', () => {
      visitFridgeAndSelectAProduct(2);

      cy.get('[data-cy=waste]').click();
      // wait for product to be added to the shopping list
      cy.wait(1000);

      cy.contains(products[2].category).should('exist');
      cy.contains(products[2].name).should('not.exist');

      cy.visit('localhost:8080');
      cy.contains('75%').should('exist');
    });
  });

  describe('adding new products', () => {
    it('can add existing products to storage', () => {
      const testProduct = {
        name: 'foo product',
        category: 'bar'
      };

      cy.callFirestore('set', `allProducts/${testProduct.name}`, testProduct);

      cy.visit('localhost:8080/fridge');
      cy.get('[data-cy=add-product]').click();

      // wait to transfer to the add-new-product page
      cy.wait(1000);

      cy.contains(testProduct.category)
        .first()
        .click();
      cy.contains(testProduct.name)
        .first()
        .click();

      cy.get('[data-cy=confirm-add-product]').click();

      cy.contains(testProduct.category).should('exist');
      cy.contains(testProduct.name).should('exist');
    });

    it('can add custom products to storage', () => {
      const testProduct = {
        name: 'foo',
        category: 'bar'
      };

      cy.visit('localhost:8080/fridge');

      cy.get('[data-cy=add-product]').click();

      cy.get('[data-cy=add-custom-product]').click();

      cy.get('[data-cy=custom-product-category-dropdown]')
        .find('select')
        .select('Add New');
      cy.get('[data-cy=custom-product-category]').type(testProduct.category);
      cy.get('[data-cy=custom-product-name]').type(testProduct.name);
      cy.get('[data-cy=confirm-add-custom-product]').click();

      cy.contains(testProduct.category).should('exist');
      cy.contains(testProduct.name).should('exist');
    });

    it('can add existing products to shopping list', () => {
      const testProduct = {
        name: 'foo product',
        category: 'bar'
      };

      cy.callFirestore('set', `allProducts/${testProduct.name}`, testProduct);

      cy.visit('localhost:8080/shopping-list');
      cy.get('[data-cy=add-product]').click();

      // wait to transfer to the add-new-product page
      cy.wait(1000);

      cy.contains(testProduct.category)
        .first()
        .click();
      cy.contains(testProduct.name)
        .first()
        .click();

      cy.get('[data-cy=confirm-add-product]').click();

      cy.contains(testProduct.category).should('exist');
      cy.contains(testProduct.name).should('exist');
    });

    it('can add custom products to shopping list', () => {
      const testProduct = {
        name: 'foo',
        category: 'bar'
      };

      cy.visit('localhost:8080/shopping-list');

      cy.get('[data-cy=add-product]').click();

      cy.get('[data-cy=add-custom-product]').click();

      cy.get('[data-cy=custom-product-category-dropdown]')
        .find('select')
        .select('Add New');
      cy.get('[data-cy=custom-product-category]').type(testProduct.category);
      cy.get('[data-cy=custom-product-name]').type(testProduct.name);
      cy.get('[data-cy=confirm-add-custom-product]').click();

      cy.contains(testProduct.category).should('exist');
      cy.contains(testProduct.name).should('exist');
    });
  });
});
