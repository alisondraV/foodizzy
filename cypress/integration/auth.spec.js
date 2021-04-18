import user from '../fixtures/user.json';

describe('Authentication', () => {
  const productsToAdd = ['Apple', 'Beef', 'Broccoli', 'Carrot'];
  it('test', () => {
    cy.visit('localhost:8080/fridge-setup');
  });

  it.only('signs the user up', () => {
    cy.visit('localhost:8080/sign-up');

    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=name]').type(user.name);
    cy.get('[data-cy=password]').type(user.password);
    cy.get('[data-cy=sign-up]').click();
    cy.url().should('include', '/onboarding-track-waste');

    cy.contains('Skip')
      .first()
      .click();
    cy.url().should('include', '/create-family');

    cy.get('[data-cy=name]').type(user.familyName);
    cy.get('[data-cy=create]').click();
    cy.url().should('include', '/fridge-setup');

    productsToAdd.forEach(product =>
      cy
        .contains(product)
        .first()
        .click({ force: true })
    );
    cy.get('[data-cy=add-products]').click();
    cy.url().should('equal', 'http://localhost:8080/');
  });

  it('signs the user in', () => {
    cy.visit('localhost:8080/sign-in');

    cy.get('[data-cy=email]').type(user.email);
    cy.get('[data-cy=password]').type(user.password);
    cy.get('[data-cy=sign-in]').click();

    cy.url().should('equal', 'http://localhost:8080/');
  });
});
