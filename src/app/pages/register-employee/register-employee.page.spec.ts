import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterEmployeePage } from './register-employee.page';

describe('RegisterEmployeePage', () => {
  let component: RegisterEmployeePage;
  let fixture: ComponentFixture<RegisterEmployeePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmployeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
