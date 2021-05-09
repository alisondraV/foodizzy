import { productsData } from '../fixtures';

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

  function visitPageAndSelectAProduct({ page, index }) {
    cy.visit(`localhost:8080/${page}`);

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

    cy.createUser();
    cy.setUpFamily();
    cy.signIn();
  });

  describe('moving products around', () => {
    describe('storage', () => {
      it('can move product from storage to shopping list', () => {
        visitPageAndSelectAProduct({ page: 'fridge', index: 0 });
        selectProduct(products[3]);

        cy.get('[data-cy=consume]').click();
        // wait for product to be added to the shopping list
        cy.wait(1000);
        cy.contains(products[0].category).should('not.exist');

        cy.visit('localhost:8080/shopping-list');
        // wait for products load
        cy.wait(1000);
        assertProductExistsInList(products[0]);
      });

      it('can delete product from storage', () => {
        visitPageAndSelectAProduct({ page: 'fridge', index: 1 });

        cy.get('[data-cy=remove]').click();
        // wait for product to be added to the shopping list
        cy.wait(1000);

        cy.contains(products[1].category).should('not.exist');
        cy.contains(products[1].name).should('not.exist');
      });

      it('can waste product from storage', () => {
        visitPageAndSelectAProduct({ page: 'fridge', index: 2 });

        cy.get('[data-cy=waste]').click();
        // wait for product to be added to the shopping list
        cy.wait(1000);

        cy.contains(products[2].category).should('not.exist');

        cy.visit('localhost:8080');
        // wait the statistics to load
        cy.wait(2000);

        cy.contains('75%').should('exist');
      });
    });

    describe('shopping list', () => {
      it('can delete product from shopping list', () => {
        visitPageAndSelectAProduct({ page: 'shopping-list', index: 0 });
        cy.get('[data-cy=delete]').click();
        // wait for product to be added to the shopping list
        cy.wait(1000);

        cy.contains(products[0].category).should('not.exist');
        cy.contains(products[0].name).should('not.exist');
      });

      it('can move product from shopping list to storage', () => {
        visitPageAndSelectAProduct({ page: 'shopping-list', index: 3 });
        cy.get('[data-cy=purchase]').click();
        // wait for product to be added to the shopping list
        cy.wait(1000);

        cy.contains(products[3].category).should('not.exist');
        cy.contains(products[3].name).should('not.exist');

        cy.visit('localhost:8080/fridge');
        // wait for products load
        cy.wait(1000);
        assertProductExistsInList(products[3]);
      });
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

    ['fridge', 'shopping-list'].forEach(location => {
      const testProduct = {
        name: `custom product in ${location}`,
        category: 'Custom'
      };

      it(`can add existing products to ${location}`, () => {
        cy.visit(`localhost:8080/${location}`);
        cy.get('[data-cy=add-product]').click();

        // wait to transfer to the add-new-product page
        cy.wait(1000);

        selectProduct(newProduct);

        cy.get('[data-cy=confirm-add-product]').click();

        // wait for the page to load
        cy.wait(1000);

        assertProductExistsInList(newProduct);
      });

      it(`can add custom products to ${location}`, () => {
        cy.visit(`localhost:8080/${location}`);
        cy.get('[data-cy=add-product]').click();

        cy.get('[data-cy=add-custom-product]').click();
        cy.get('[data-cy=custom-product-category-dropdown]')
          .find('select')
          .select('Add New');

        cy.get('[data-cy=custom-product-category]').type(testProduct.category);
        cy.get('[data-cy=custom-product-name]').type(testProduct.name);
        cy.get('[data-cy=confirm-add-custom-product]').click();

        // wait for the page to load
        cy.wait(1000);
        cy.url().should('include', `/${location}`);

        assertProductExistsInList(testProduct);
      });

      it('can not add custom products which already exist in the list', () => {
        cy.visit(`localhost:8080/${location}`);
        cy.get('[data-cy=add-product]').click();
        cy.get('[data-cy=add-custom-product]').click();

        cy.get('[data-cy=custom-product-name]').type(testProduct.name);
        cy.get('[data-cy=confirm-add-custom-product]').click();
        cy.url().should('include', '/custom-product');
      });
    });
  });
});
