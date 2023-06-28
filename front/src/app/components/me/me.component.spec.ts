import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;

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
    const userService = TestBed.inject(UserService);
    const getByIdSpy = jest
      .spyOn(userService, 'getById')
      .mockReturnValue(of(mockUser)); // mock the return value of the getById method

    // call the ngOnInit method
    component.ngOnInit();

    // check that the user property is equal to the mockUser object
    expect(component.user).toEqual(mockUser);
  });
});
