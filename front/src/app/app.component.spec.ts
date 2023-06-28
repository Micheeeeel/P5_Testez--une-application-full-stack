import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';

describe('AppComponent', () => {
  let component: AppComponent;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent],
      providers: [AuthService, SessionService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router); // Inject the Router

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout method and navigate to home', () => {
    const spyLogOut = jest.spyOn(sessionService, 'logOut');
    const spyNav = jest.spyOn(router, 'navigate'); // Use the injected Router

    component.logout();

    expect(spyLogOut).toHaveBeenCalled();
    expect(spyNav).toHaveBeenCalledWith(['']);
  });

  it('should return the value of $isLogged method from sessionService', () => {
    const isLoggedValue = true;
    const sessionServiceSpy = jest
      .spyOn(sessionService, '$isLogged')
      .mockReturnValue(of(isLoggedValue));

    const result: Observable<boolean> = component.$isLogged();

    result.subscribe((value) => {
      expect(value).toEqual(isLoggedValue);
    });

    expect(sessionServiceSpy).toHaveBeenCalled();
  });
});
