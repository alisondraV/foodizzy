describe('Authentication', () => {
    const user = {
        name: 'Panda',
        email: 'panda@test.com',
        password: 'pandathebest'
    };

    it('signs the user up', () => {
        cy.visit('localhost:8080/sign-up');

        cy.get('input[type=email]').type(user.email);
        cy.get('input[type=text]').type(user.name);
        cy.get('input[type=password]').type(user.password);
        cy.get('button').first().click();

        cy.url().should('include', '/create-family');
    });
});