import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterCompanionPage } from './register-companion.page';

describe('RegisterCompanionPage', () => {
  let component: RegisterCompanionPage;
  let fixture: ComponentFixture<RegisterCompanionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCompanionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
