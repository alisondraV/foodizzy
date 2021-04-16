import user from '../fixtures/user.json';

describe('Authentication', () => {
  it.only('test', () => {
    cy.callFirestore('add', 'test_hello_world', { some: 'value' });
  });

  it('signs the user up', () => {
    cy.visit('localhost:8080/sign-up');

    cy.get('input[type=email]').type(user.email);
    cy.get('input[type=text]').type(user.name);
    cy.get('input[type=password]').type(user.password);
    cy.get('button')
      .first()
      .click();

    cy.url().should('include', '/onboarding-track-waste');
  });
});
