import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryMethodPage } from './entry-method.page';

describe('EntryMethodPage', () => {
  let component: EntryMethodPage;
  let fixture: ComponentFixture<EntryMethodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryMethodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
