import { YogaLogin } from '../pages/yogaLogin';

describe('Register spec', () => {
  let loginPage: YogaLogin;

  beforeEach(() => {
    loginPage = new YogaLogin();
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
