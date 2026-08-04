import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterVisitorPage } from './register-visitor.page';

describe('RegisterVisitorPage', () => {
  let component: RegisterVisitorPage;
  let fixture: ComponentFixture<RegisterVisitorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterVisitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
