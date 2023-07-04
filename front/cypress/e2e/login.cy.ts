describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
  });

  it('Login unsuccessful - wrong credentials', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401, // Unauthorized status code
      body: {
        error: 'Bad credentials',
      },
    });

    cy.get('input[formControlName=email]').type('wrong@email');
    cy.get('input[formControlName=password]').type('wrongPassword');

    cy.contains('Submit').click();

    cy.contains('An error occurred').should('be.visible');
  });
});
