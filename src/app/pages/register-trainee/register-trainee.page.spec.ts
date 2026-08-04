import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterTraineePage } from './register-trainee.page';

describe('RegisterTraineePage', () => {
  let component: RegisterTraineePage;
  let fixture: ComponentFixture<RegisterTraineePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTraineePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
