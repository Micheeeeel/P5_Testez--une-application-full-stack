describe('Create Session, Update, Verify Details, and Delete Session', () => {
  beforeEach(() => {
    // Log in as an admin user
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
  });

  it('Create, Update, Verify Details, and Delete Session', () => {
    // Click on the "Create" button
    cy.get('button[routerLink="create"]').click();

    // Fill out the form to create a new session
    cy.get('input[formControlName=name]').type('Session de test');
    cy.get('textarea[formControlName="description"]').type(
      'Join our yoga session for a relaxing experience.'
    );
    cy.get('input[formControlName="date"]').type('2023-07-10');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('button[type="submit"]').click();

    // Verify that the success message for session creation is displayed
    cy.contains('Session created').should('be.visible');

    // Verify that the session is displayed in the list
    cy.contains('Session de test').should('be.visible');

    // Click on the "Edit" button
    cy.contains('Edit').click();

    // Update the session details
    cy.get('input[formControlName=name]').clear().type('Updated Session');
    cy.get('textarea[formControlName="description"]')
      .clear()
      .type('Join our updated yoga session.');
    cy.get('input[formControlName="date"]').clear().type('2023-07-15');
    cy.get('button[type="submit"]').click();

    // Verify that the success message for session update is displayed
    cy.contains('Session updated').should('be.visible');

    // Verify that the updated session details are displayed
    cy.contains('Updated Session').should('be.visible');
    cy.contains('Join our updated yoga session.').should('be.visible');
    cy.contains('July 15, 2023').should('be.visible');

    // Click on the "Detail" button of the newly created session
    cy.get('.items mat-card')
      .last()
      .within(() => {
        cy.contains('Detail').click();
      });

    // Verify that the session details are displayed correctly
    cy.get('mat-card-title').should('contain', 'Session De Test');
    cy.get('mat-card-content').should(
      'contain',
      'Join our yoga session for a relaxing experience.'
    );
    cy.get('mat-card-content').should('contain', 'July 10, 2023');

    // Click on the "Delete" button
    cy.contains('Delete').click();

    // Verify that the success message for session deletion is displayed
    cy.contains('Session deleted').should('be.visible');
  });
});
