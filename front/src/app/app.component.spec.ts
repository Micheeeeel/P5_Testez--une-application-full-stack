import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let authService: AuthService;
  let sessionsService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent],
      providers: [AuthService, SessionService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    sessionsService = TestBed.inject(SessionService);

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout', () => {
    const spy = jest.spyOn(sessionsService, 'logOut');
    component.logout();
    expect(spy).toHaveBeenCalled();
  });
});
