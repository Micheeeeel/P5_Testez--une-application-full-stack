export class YogaLogin {
  public visitLogin(): void {
    cy.visit('/login');
  }

  public visitRegister(): void {
    cy.visit('/register');
  }

  public inspectRegisterFormVisibility() {
    cy.get('app-register').should('be.visible');
    cy.get('app-register form').should('be.visible');
    cy.get('app-register form input[formControlName=firstName]').should(
      'be.visible'
    );
    cy.get('app-register form input[formControlName=lastName]').should(
      'be.visible'
    );
    cy.get('app-register form input[formControlName=email]').should(
      'be.visible'
    );
    cy.get('app-register form input[formControlName=password]').should(
      'be.visible'
    );
    cy.get('app-register form button[type="submit"]').should('be.visible');
  }

  public inspectLoginFormVisibility() {
    cy.get('app-login').should('be.visible');
    cy.get('app-login form').should('be.visible');
    cy.get('app-login form input[formControlName=email]').should('be.visible');
    cy.get('app-login form input[formControlName=password]').should(
      'be.visible'
    );
    cy.get('app-login form button[type="submit"]').should('be.visible');
  }

  public inspectRegisterFormInitialization() {
    cy.get('input[formControlName=firstName]').should('have.value', '');
    cy.get('input[formControlName=lastName]').should('have.value', '');
    cy.get('input[formControlName=email]').should('have.value', '');
    cy.get('input[formControlName=password]').should('have.value', '');
  }

  public inspectLoginFormInitialization() {
    cy.get('input[formControlName=email]').should('have.value', '');
    cy.get('input[formControlName=password]').should('have.value', '');
  }

  public FillRegisterForm(firstnam, lastname, email, password) {
    this.fillFirstNameField(firstnam);
    this.fillLastNameField(lastname);
    this.fillEmailField(email);
    this.fillPasswordField(password);
  }

  public fillLoginForm(email, password) {
    this.fillEmailField(email);
    this.fillPasswordField(password);
  }

  public fillFirstNameField(firstname) {
    cy.get('input[formControlName=firstName]').type(firstname);
  }

  public fillLastNameField(lastname) {
    cy.get('input[formControlName=lastName]').type(lastname);
  }

  public fillEmailField(email) {
    cy.get('input[formControlName=email]').type(email);
  }

  public fillPasswordField(password) {
    cy.get('input[formControlName=password]').type(password);
  }

  public login(email, password) {
    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`);
  }
}
