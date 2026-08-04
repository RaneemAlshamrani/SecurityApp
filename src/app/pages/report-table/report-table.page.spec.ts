import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportTablePage } from './report-table.page';

describe('ReportTablePage', () => {
  let component: ReportTablePage;
  let fixture: ComponentFixture<ReportTablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
