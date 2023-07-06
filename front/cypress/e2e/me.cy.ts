import { YogaLogin } from '../pages/yogaLogin';

describe('MeComponent', () => {
  let loginPage: YogaLogin;

  beforeEach(() => {
    loginPage = new YogaLogin();
    loginPage.visitLogin(); // Visite de la page de connexion avant chaque test

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

    //intercept the GET request to /api/me
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      admin: false,
      createdAt: new Date(2023, 4, 1),
      updatedAt: new Date(2023, 4, 5),
    };

    cy.intercept('GET', '/api/user/1', {
      body: user,
    }).as('getUser');

    loginPage.login('yoga@studio.com', 'test!1234'); // Appel de la méthode de connexion de la classe utilitaire

    // wait for the session request to complete
    cy.wait('@session');

    cy.url().should('include', '/sessions');

    // mettre à jour le DOM pour que le bouton Account soit visible
    cy.contains('span.link', 'Account').should('be.visible');

    // click on link Account
    cy.contains('span.link', 'Account').click();
  });

  it('should display user details and navigate back when back button is clicked', () => {
    cy.wait('@getUser');

    cy.contains('Name: John DOE').should('be.visible');
    cy.contains('Email: john.doe@example.com').should('be.visible');
    cy.contains('Delete my account:').should('be.visible');
    cy.contains('Create at:').should('be.visible');
    cy.contains('Last update:').should('be.visible');

    // Cliquez sur le bouton 'back' et vérifiez que vous êtes redirigé vers la page précédente
    cy.get('button[mat-icon-button]').click();
    cy.url().should('not.include', '/me');

    // wait for the session request to complete
    cy.wait('@session');

    cy.url().should('include', '/sessions');
  });

  it('should delete account when delete button is clicked', () => {
    cy.wait('@getUser');

    // intercept the DELETE request to /api/user/1
    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 204,
    }).as('deleteUser');

    // intercept the POST request to /api/auth/logout
    cy.intercept('POST', '/api/auth/logout', {
      statusCode: 204,
    }).as('logout');

    // intercept the GET request to /api/session
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.contains('Delete my account:').click();
    cy.get('button.mat-raised-button').click();

    // wait for the deleteUser request to complete
    cy.wait('@deleteUser');

    // verify that the user is redirected to root
    cy.url().should('not.include', '/me');
  });
});
