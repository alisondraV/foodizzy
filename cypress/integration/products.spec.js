import productsData from '../fixtures/products.json';
import user from '../fixtures/user.json';

describe('product CRUD', () => {
  const products = productsData.products;

  function selectProduct(product) {
    cy.contains(product.category)
      .first()
      .click();
    cy.contains(product.name)
      .first()
      .click();
  }

  function visitFridgeAndSelectAProduct(index) {
    cy.visit('localhost:8080/fridge');

    selectProduct(products[index]);
  }

  function assertProductExistsInList(product) {
    cy.contains(product.category)
      .first()
      .click();
    cy.contains(product.name).should('exist');
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
      assertProductExistsInList(products[0]);
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
    const newProduct = {
      name: 'foo product',
      category: 'bar'
    };

    before(() => {
      cy.callFirestore('set', `allProducts/${newProduct.name}`, newProduct);
    });

    it('can add existing products to storage', () => {
      cy.visit('localhost:8080/fridge');
      cy.get('[data-cy=add-product]').click();

      // wait to transfer to the add-new-product page
      cy.wait(1000);

      selectProduct(newProduct);

      cy.get('[data-cy=confirm-add-product]').click();

      // wait to transfer to the storage page
      cy.wait(1000);

      assertProductExistsInList(newProduct);
    });

    it('can add custom products to storage', () => {
      const testProduct = {
        name: 'custom product 1',
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

      // wait for the storage to load
      cy.wait(1000);

      assertProductExistsInList(testProduct);
    });

    it('can add existing products to shopping list', () => {
      cy.visit('localhost:8080/shopping-list');
      cy.get('[data-cy=add-product]').click();

      // wait to transfer to the add-new-product page
      cy.wait(1000);

      selectProduct(newProduct);

      cy.get('[data-cy=confirm-add-product]').click();

      // wait to transfer to the shopping-list page
      cy.wait(1000);

      assertProductExistsInList(newProduct);
    });

    it('can add custom products to shopping list', () => {
      const testProduct = {
        name: 'custom product 2',
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

      // wait for the shopping list to load
      cy.wait(1000);

      assertProductExistsInList(testProduct);
    });
  });
});
