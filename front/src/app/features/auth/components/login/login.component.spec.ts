import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let authService: AuthService;
  let router: Router;
  let loginRequest: { email: string; password: string };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    sessionService = TestBed.inject(SessionService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    loginRequest = {
      email: 'mockUsername@example.com',
      password: 'password',
    }; // Crée une requête de connexion
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make the form invalid when it is empty', () => {
    component.form.setValue({
      email: '',
      password: '',
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('should make the form invalid when the fields are filled incorrectly', () => {
    component.form.setValue({
      email: 'invalidemail', // Invalid email
      password: 'pass',
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('should make the form valid when all fields are filled correctly', () => {
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should call the submit method when the form is submitted', () => {
    const submitSpy = jest.spyOn(component, 'submit'); // Create a spy on the submit method

    // simulate the form being submitted by triggering the submit event on the form
    const form = fixture.nativeElement.querySelector('form'); // Get the DOM element representing the form
    form.dispatchEvent(new Event('submit')); // trigger the submit event by creating a new instance of the event and dispatching it on the form

    expect(submitSpy).toHaveBeenCalled(); // Check that the submit method has been called
  });

  it('should set onError to true when login fails', () => {
    // Arrange
    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Login error'))); // Simulate an error

    // Set form values
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    // Act
    component.submit(); // Call the submit method
    //fixture.detectChanges(); // Update the component

    // Assert
    expect(component.onError).toBeTruthy();
  });

  // Test d'intégration pour la méthode 'submit'
  it('should call authService.login and navigate to "/sessions" on successful login', () => {
    const sessionInformation = {
      token: 'mockToken',
      type: 'mockType',
      id: 1,
      username: 'mockUsername',
      firstName: 'mockFirstName',
      lastName: 'mockLastName',
      admin: true,
    };

    jest.spyOn(authService, 'login').mockReturnValue(of(sessionInformation)); // Crée un espion sur la méthode 'login' du service 'authService' et retourne un observable contenant les informations de session
    const sessionLoginSpy = jest.spyOn(sessionService, 'logIn'); // Crée un espion sur la méthode 'logIn' du service 'sessionService'
    const routerNavigateSpy = jest.spyOn(router, 'navigate'); // Crée un espion sur la méthode 'navigate' du service 'router'

    // Set form values
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    // Trigger submit
    component.submit();

    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(sessionLoginSpy).toHaveBeenCalledWith(sessionInformation);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should enable submit button only when form fields are filled', async () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    ); // Get the submit button

    expect(submitButton.disabled).toBeTruthy(); // Vérifie que le bouton de soumission est désactivé initialement;

    // Set form values
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);
    fixture.detectChanges(); // Update the component

    expect(submitButton.disabled).toBeFalsy(); // Vérifie que le bouton de soumission est activé après avoir rempli les champs du formulaire
  });
});
