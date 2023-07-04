import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { last } from 'cypress/types/lodash';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should make the form valid when it is not empty`, () => {
    component.form.setValue({
      email: 'mockUsername@example.com',
      password: 'password',
      lastName: 'mockLastName',
      firstName: 'mockFirstName',
    });

    expect(component.form.valid).toBeTruthy();
  });

  it(`should make the form invalid when it is not well filled`, () => {
    component.form.setValue({
      email: 'mockUsername@example.com',
      password: '',
      lastName: 'mockLastName',
      firstName: 'mockFirstName',
    });
    expect(component.form.valid).toBeFalsy();
  });
});
