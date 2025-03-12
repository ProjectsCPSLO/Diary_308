// eslint-disable-next-line no-undef
describe('Login E2E', () => {
  it('should log in and ensure log in happened', () => {
    cy.visit('https://proud-mud-0b66be61e.6.azurestaticapps.net/');

    cy.get('input[name="email"').type('test@example.com');
    cy.get('input[name="password"').type('Password@123');
    cy.get('button[type="submit"]').click();
    cy.contains('Create a Post').should('be.visible');
  });
});
