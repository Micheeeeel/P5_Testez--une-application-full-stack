describe('Create Session, Update, Verify Details, and Delete Session', () => {
  it('Create, Update, Verify Details, and Delete Session', () => {
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

    // mock the response for the GET request to /api/session
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Session de test',
          description: 'Join our yoga session for a relaxing experience.',
          date: '2023-07-10',
          teacher_id: 1,
        },
      ]
    ).as('session');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'Session de test',
        description: 'Join our yoga session for a relaxing experience.',
        date: '2023-07-10',
        teacher_id: 1,
      }
    ).as('session1');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          firstName: 'Margot',
          lastName: 'DELAHAYE',
          email: 'margot@truc.com',
          password: 'test',
          admin: true,
        },
      ]
    ).as('teacher');

    cy.intercept(
      {
        method: 'POST',
        url: '/api/session',
      },
      {
        statusCode: 201,
        body: {
          id: 1,
          name: 'Session de test',
          description: 'Join our yoga session for a relaxing experience.',
          date: '2023-07-10',
          teacher_id: 1,
        },
      }
    ).as('createSession');

    cy.intercept(
      {
        method: 'PUT',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Updated Session',
          description: 'Join our updated yoga session.',
          date: '2023-07-15',
          teacher_id: 1,
        },
      }
    ).as('updateSession');

    cy.intercept(
      {
        method: 'DELETE',
        url: '/api/session/1',
      },
      {
        statusCode: 204,
      }
    ).as('deleteSession');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');

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

    // wait for the GET request to /api/session to return
    cy.wait('@session');

    // Verify that the session is displayed in the list
    cy.contains('Session de test').should('be.visible');

    // Click on the "Edit" button
    cy.contains('Edit').click();

    // wait for the GET request to /api/session/1 to return
    cy.wait('@session1');

    // Update the session details
    cy.get('input[formControlName=name]').clear().type('Updated Session');
    cy.get('textarea[formControlName="description"]')
      .clear()
      .type('Join our updated yoga session.');
    cy.get('input[formControlName="date"]').clear().type('2023-07-15');
    cy.get('button[type="submit"]').click();

    // wait for the PUT request to /api/session/1 to return
    cy.wait('@updateSession');

    // Verify that the success message for session update is displayed
    cy.contains('Session updated').should('be.visible');

    // wait for the GET request to /api/session to return
    cy.wait('@session');

    // Click on the "Detail" button of the newly created session
    cy.get('.items mat-card')
      .last()
      .within(() => {
        cy.contains('Detail').click();
      });

    // Verify that the session details are displayed correctly
    cy.get('mat-card-title').should('contain', 'Session De Test');
    // cy.get('mat-card-content').should(
    //   'contain',
    //   'Join our yoga session for a relaxing experience.'
    // );
    // cy.get('mat-card-content').should('contain', 'July 10, 2023');

    // Click on the "Delete" button
    cy.contains('Delete').click();

    // wait for the DELETE request to /api/session/1 to return
    cy.wait('@deleteSession');

    // Verify that the success message for session deletion is displayed
    cy.contains('Session deleted').should('be.visible');
  });
});
