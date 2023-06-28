import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionsModule } from 'src/app/features/sessions/sessions.module';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let matSnackBar: MatSnackBar;
  let sessionService: SessionService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userService = TestBed.inject(UserService);
    matSnackBar = TestBed.inject(MatSnackBar);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Check that component is created

    expect(component.user).toBeUndefined(); // Check that user is undefined
  });

  it('should call back method', () => {
    const spyBack = jest.spyOn(window.history, 'back'); // Use the injected Router

    component.back();

    expect(spyBack).toHaveBeenCalled(); // Check that window.history back method has been called
  });

  it('should initialize user property', () => {
    // create a false user object
    const mockUser: User = {
      id: 1,
      email: 'toto@gmail.toto',
      password: 'toto',
      admin: true,
      firstName: 'toto',
      lastName: 'toto',
      createdAt: new Date(),
    };

    // create a spy on the userService getById method
    const getByIdSpy = jest
      .spyOn(userService, 'getById')
      .mockReturnValue(of(mockUser)); // mock the return value of the getById method

    // call the ngOnInit method
    component.ngOnInit();

    expect(getByIdSpy).toHaveBeenCalledWith('1'); // check that the getById method has been called with the right argument

    expect(component.user).toEqual(mockUser); // check that the user property is equal to the mockUser object
  });

  it('should delete the user account and perform necessary actions', () => {
    // Mock session information
    const sessionInformation = {
      token: 'mockToken',
      type: 'mockType',
      id: 1,
      username: 'mockUsername',
      firstName: 'mockFirstName',
      lastName: 'mockLastName',
      admin: true,
    };

    sessionService.sessionInformation = sessionInformation;

    // Create spies for the required services
    const deleteSpy = jest.spyOn(userService, 'delete').mockReturnValue(of({}));
    const matSnackBarSpy = jest.spyOn(matSnackBar, 'open');
    // const logOut = jest.spyOn(sessionService, 'logOut');
    // const navigateSpy = jest.spyOn(router, 'navigate');

    // Call the delete method
    component.delete();

    // Verify that userService.delete is called with the correct argument
    expect(deleteSpy).toHaveBeenCalledWith('1');

    // Verify that matSnackBar.open is called with the correct arguments
    expect(matSnackBarSpy).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );

    // // Verify that sessionService.logOut is called
    // expect(logOut).toHaveBeenCalled();

    // // Verify that router.navigate is called with the correct argument
    // expect(navigateSpy).toHaveBeenCalled();
  });
});
