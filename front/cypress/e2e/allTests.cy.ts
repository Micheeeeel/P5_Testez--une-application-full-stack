import { TestUtil } from '../pages/yogaLogin';

describe('Login spec', () => {
  let loginPage: TestUtil;

  beforeEach(() => {
    loginPage = new TestUtil();
    loginPage.visitLogin(); // Visite de la page de connexion avant chaque test
  });

  it('components should be visible', () => {
    loginPage.inspectLoginFormVisibility();
  });

  it('constructor should initialize the form', () => {
    loginPage.inspectLoginFormInitialization();
  });

  it('Submit button is disabled until all fields are filled correctly', () => {
    // Vérifier que le bouton "Submit" est désactivé initialement
    cy.get('button[type="submit"]').should('be.disabled');

    loginPage.fillLoginForm('user@example.com', 'password');

    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('Submit button is disabled if the email is invalid', () => {
    loginPage.fillLoginForm('wrongEmail', 'password');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Login successfull', () => {
    // Interception de la requête POST vers /api/auth/login
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Interception de la requête GET vers /api/session
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    loginPage.login('yoga@studio.com', 'test!1234'); // Appel de la méthode de connexion de la classe utilitaire

    cy.url().should('include', '/sessions');
  });

  it('Login unsuccessful - wrong credentials', () => {
    // Interception de la requête POST vers /api/auth/login avec erreur 401
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        error: 'Bad credentials',
      },
    }).as('wrongLogin');

    loginPage.login('wrong', 'wrongPassword'); // Appel de la méthode de connexion de la classe utilitaire

    cy.wait('@wrongLogin');

    cy.contains('An error occurred').should('be.visible');
  });
});

describe('Register spec', () => {
  let loginPage: TestUtil;

  beforeEach(() => {
    loginPage = new TestUtil();
    loginPage.visitRegister(); // Visite de la page de connexion avant chaque test
  });

  it('components should be visible', () => {
    loginPage.inspectRegisterFormVisibility();
  });

  it('constructor should initialize the form', () => {
    loginPage.inspectRegisterFormInitialization();
  });

  it('Submit button is disabled until all fields are filled correctly', () => {
    // Vérifier que le bouton "Submit" est désactivé initialement
    cy.get('button[type="submit"]').should('be.disabled');

    loginPage.fillFirstNameField('New');
    cy.get('button[type="submit"]').should('be.disabled'); // Vérifier que le bouton "Submit" est maintenant activé

    loginPage.fillLastNameField('newUser');
    cy.get('button[type="submit"]').should('be.disabled');

    loginPage.fillEmailField('newUser@example.com');
    cy.get('button[type="submit"]').should('be.disabled');

    loginPage.fillPasswordField('password123');

    // Vérifier que le bouton "Submit" est maintenant activé
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('Submit button is disabled if the email is invalid', () => {
    loginPage.FillRegisterForm('New', 'newUser', 'wrongEmail', 'password123');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Register new user', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201, // Created status code
      body: {
        id: 2,
        firstName: 'New',
        lastName: 'User',
        admin: false,
      },
    }).as('register');

    loginPage.FillRegisterForm(
      'New',
      'newUser',
      'newUser@example.com',
      'password123'
    );

    // cliquer sur le bouton "Submit"
    cy.get('button[type="submit"]').click();

    cy.wait('@register');

    // vérifier que l'utilisateur est redirigé vers la page de login
    cy.url().should('include', '/login');
  });
});

describe('MeComponent', () => {
  let loginPage: TestUtil;

  beforeEach(() => {
    loginPage = new TestUtil();
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

describe('Create Session, Update, Verify Details, and Delete Session', () => {
  let loginPage: TestUtil;

  it('Create, Update, Verify Details, and Delete Session', () => {
    loginPage = new TestUtil();
    loginPage.visitLogin(); // Visite de la page de connexion avant chaque test

    // Intercept the login request and mock the response
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Intercept the GET request to /api/session and mock the response
    cy.intercept('GET', '/api/session', [
      {
        id: 1,
        name: 'Session de test',
        description: 'Join our yoga session for a relaxing experience.',
        date: '2023-07-10',
        teacher_id: 1,
      },
    ]).as('session');

    // Intercept the GET request to /api/session/1 and mock the response
    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'Session de test',
      description: 'Join our yoga session for a relaxing experience.',
      date: '2023-07-10',
      teacher_id: 1,
    }).as('session1');

    // Intercept the GET request to /api/teacher and mock the response
    cy.intercept('GET', '/api/teacher', [
      {
        id: 1,
        firstName: 'Margot',
        lastName: 'DELAHAYE',
        email: 'margot@truc.com',
        password: 'test',
        admin: true,
      },
    ]).as('teacher');

    // Intercept the POST request to /api/session and mock the response
    cy.intercept('POST', '/api/session', {
      statusCode: 201,
      body: {
        id: 1,
        name: 'Session de test',
        description: 'Join our yoga session for a relaxing experience.',
        date: '2023-07-10',
        teacher_id: 1,
      },
    }).as('createSession');

    // Intercept the PUT request to /api/session/1 and mock the response
    cy.intercept('PUT', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Updated Session',
        description: 'Join our updated yoga session.',
        date: '2023-07-15',
        teacher_id: 1,
      },
    }).as('updateSession');

    // Intercept the DELETE request to /api/session/1 and mock the response
    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 204,
    }).as('deleteSession');

    // Enter login credentials and submit the form
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Assert that the URL includes '/sessions' indicating successful login
    cy.url().should('include', '/sessions');

    // Click on the "Create" button to create a new session
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

    // Assert that the success message for session creation is displayed
    cy.contains('Session created').should('be.visible');

    // Wait for the GET request to /api/session to return
    cy.wait('@session');

    // Assert that the session is displayed in the list
    cy.contains('Session de test').should('be.visible');

    // Click on the "Edit" button to edit the session
    cy.contains('Edit').click();

    // Wait for the GET request to /api/session/1 to return
    cy.wait('@session1');

    // Update the session details
    cy.get('input[formControlName=name]').clear().type('Updated Session');
    cy.get('textarea[formControlName="description"]')
      .clear()
      .type('Join our updated yoga session.');
    cy.get('input[formControlName="date"]').clear().type('2023-07-15');
    cy.get('button[type="submit"]').click();

    // Wait for the PUT request to /api/session/1 to return
    cy.wait('@updateSession');

    // Assert that the success message for session update is displayed
    cy.contains('Session updated').should('be.visible');

    // Wait for the GET request to /api/session to return
    cy.wait('@session');

    // Click on the "Detail" button of the newly created session
    cy.get('.items mat-card')
      .last()
      .within(() => {
        cy.contains('Detail').click();
      });

    // Assert that the session details are displayed correctly
    cy.get('mat-card-title').should('contain', 'Session De Test');
    // cy.get('mat-card-content').should('contain', 'Join our yoga session for a relaxing experience.');
    // cy.get('mat-card-content').should('contain', 'July 10, 2023');

    // Click on the "Delete" button to delete the session
    cy.contains('Delete').click();

    // Wait for the DELETE request to /api/session/1 to return
    cy.wait('@deleteSession');

    // Assert that the success message for session deletion is displayed
    cy.contains('Session deleted').should('be.visible');
  });
});

describe('Test the not found component', () => {
  it('should redirect to the not found page', () => {
    cy.visit('/not-found');

    cy.contains('Page not found').should('be.visible');
  });
});
