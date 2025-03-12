// eslint-disable-next-line no-undef
describe('E2E', () => {
  it('should make a post and ensure it posts', () => {
    cy.visit('https://proud-mud-0b66be61e.6.azurestaticapps.net/');

    cy.get('input[name="email"').type('test@example.com');
    cy.get('input[name="password"').type('Password@123');
    cy.get('button[type="submit"]').click();
    const randomTitle = `Test Title #${Math.floor(Math.random() * 1000000)}`;

    cy.log(`Random Title: ${randomTitle}`);
    cy.get('input[name="title"]').type(randomTitle);
    cy.get('.ql-editor')
      .click()
      .clear()
      .type('Another example post ' + randomTitle, { force: true });
    cy.get('.MuiSelect-select').click();
    cy.get('li[role="option"]').contains('Happy').click();
    cy.get('.MuiSelect-select').should('contain', 'Happy');
    cy.get('input[type="checkbox"]').first().should('be.checked');
    cy.get('input[type="checkbox"]').first().click();
    cy.get('input[type="checkbox"]').first().should('not.be.checked');
    cy.get('button[type="submit"]').contains('POST').click();

    cy.contains(randomTitle).should('be.visible').click();
    cy.contains('Another example post ' + randomTitle).should('be.visible');
  });
});
