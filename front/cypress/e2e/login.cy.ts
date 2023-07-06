// import { YogaLogin } from '../pages/yogaLogin';

// describe('Login spec', () => {
//   let loginPage: YogaLogin;

//   beforeEach(() => {
//     loginPage = new YogaLogin();
//     loginPage.visitLogin(); // Visite de la page de connexion avant chaque test
//   });

//   it('components should be visible', () => {
//     loginPage.inspectLoginFormVisibility();
//   });

//   it('constructor should initialize the form', () => {
//     loginPage.inspectLoginFormInitialization();
//   });

//   it('Submit button is disabled until all fields are filled correctly', () => {
//     // Vérifier que le bouton "Submit" est désactivé initialement
//     cy.get('button[type="submit"]').should('be.disabled');

//     loginPage.fillLoginForm('user@example.com', 'password');

//     cy.get('button[type="submit"]').should('not.be.disabled');
//   });

//   it('Submit button is disabled if the email is invalid', () => {
//     loginPage.fillLoginForm('wrongEmail', 'password');
//     cy.get('button[type="submit"]').should('be.disabled');
//   });

//   it('Login successfull', () => {
//     // Interception de la requête POST vers /api/auth/login
//     cy.intercept('POST', '/api/auth/login', {
//       body: {
//         id: 1,
//         username: 'userName',
//         firstName: 'firstName',
//         lastName: 'lastName',
//         admin: true,
//       },
//     });

//     // Interception de la requête GET vers /api/session
//     cy.intercept(
//       {
//         method: 'GET',
//         url: '/api/session',
//       },
//       []
//     ).as('session');

//     loginPage.login('yoga@studio.com', 'test!1234'); // Appel de la méthode de connexion de la classe utilitaire

//     cy.url().should('include', '/sessions');
//   });

//   it('Login unsuccessful - wrong credentials', () => {
//     // Interception de la requête POST vers /api/auth/login avec erreur 401
//     cy.intercept('POST', '/api/auth/login', {
//       statusCode: 401,
//       body: {
//         error: 'Bad credentials',
//       },
//     }).as('wrongLogin');

//     loginPage.login('wrong', 'wrongPassword'); // Appel de la méthode de connexion de la classe utilitaire

//     cy.wait('@wrongLogin');

//     cy.contains('An error occurred').should('be.visible');
//   });
// });
