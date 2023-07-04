describe('Register spec', () => {
  it('Register new user', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201, // Created status code
      body: {
        id: 2,
        firstName: 'New',
        lastName: 'User',
        admin: false,
      },
    }).as('register');

    cy.get('input[formControlName=firstName]').type('New');
    cy.get('input[formControlName=lastName]').type('newUser');
    cy.get('input[formControlName=email]').type('newUser@example.com');
    cy.get('input[formControlName=password]').type('password123{enter}');

    cy.wait('@register');

    // vérifier que l'utilisateur est redirigé vers la page de login
    cy.url().should('include', '/login');
  });

  it('Submit button is disabled until all fields are filled correctly', () => {
    cy.visit('/register');

    // Vérifier que le bouton "Submit" est désactivé initialement
    cy.get('button[type="submit"]').should('be.disabled');

    // Remplir uniquement le champ "Nom d'utilisateur"
    cy.get('input[formControlName=firstName]').type('New');

    // Vérifier que le bouton "Submit" est toujours désactivé
    cy.get('button[type="submit"]').should('be.disabled');

    // Remplir uniquement le champ "Nom d'utilisateur"
    cy.get('input[formControlName=lastName]').type('newUser');

    // Vérifier que le bouton "Submit" est toujours désactivé
    cy.get('button[type="submit"]').should('be.disabled');

    // Remplir uniquement le champ "Adresse e-mail"
    cy.get('input[formControlName=email]').type('newUser@example.com');

    // Vérifier que le bouton "Submit" est toujours désactivé
    cy.get('button[type="submit"]').should('be.disabled');

    // Remplir uniquement le champ "Mot de passe"
    cy.get('input[formControlName=password]').type('password123');

    // Vérifier que le bouton "Submit" est maintenant activé
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
