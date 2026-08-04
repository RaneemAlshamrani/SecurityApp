import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.page.html',
  styleUrls: ['./report-table.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})
export class ReportTablePage {

  searchTerm = '';

  selectedCategories: string[] = [
    'employees',
    'visitors',
    'trainees',
    'companions'
  ];

  fromDate = '';
  toDate = '';

  employees: any[] = [];
  visitors: any[] = [];
  trainees: any[] = [];
  companions: any[] = [];

  constructor(
    private registrationService: RegistrationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ionViewWillEnter(): void {
    this.loadSelectedCategories();
    this.loadRegistrationData();
  }

  private loadSelectedCategories(): void {
  const categories =
    this.activatedRoute.snapshot.queryParamMap.get('categories');

  const fromDate =
    this.activatedRoute.snapshot.queryParamMap.get('fromDate');

  const toDate =
    this.activatedRoute.snapshot.queryParamMap.get('toDate');

  if (categories) {
    this.selectedCategories = categories
      .split(',')
      .filter(category => category.trim().length > 0);
  }

  if (fromDate) {
    this.fromDate = fromDate;
  }

  if (toDate) {
    this.toDate = toDate;
  }
}

  private loadRegistrationData(): void {
    this.employees =
      this.registrationService.employees ?? [];

    this.visitors =
      this.registrationService.visitors ?? [];

    this.trainees =
      this.registrationService.trainees ?? [];

    this.companions =
      this.registrationService.companions ?? [];
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  private filterRows(rows: any[]): any[] {
  const term = this.searchTerm.trim().toLowerCase();

  return rows.filter(row => {
    const rowDate = new Date(row.time);

    let matchesDate = true;

    if (!Number.isNaN(rowDate.getTime())) {
      if (this.fromDate) {
        const startDate = new Date(this.fromDate + 'T00:00:00');
        matchesDate = matchesDate && rowDate >= startDate;
      }

      if (this.toDate) {
        const endDate = new Date(this.toDate + 'T23:59:59.999');
        matchesDate = matchesDate && rowDate <= endDate;
      }
    }

    const matchesSearch =
      !term ||
      JSON.stringify(row)
        .toLowerCase()
        .includes(term);

    return matchesDate && matchesSearch;
  });
}

  get filteredEmployees(): any[] {
    return this.filterRows(this.employees);
  }

  get filteredVisitors(): any[] {
    return this.filterRows(this.visitors);
  }

  get filteredTrainees(): any[] {
    return this.filterRows(this.trainees);
  }

  get filteredCompanions(): any[] {
    return this.filterRows(this.companions);
  }
  get hasAnyData(): boolean {
  return (
    (this.isSelected('employees') &&
      this.filteredEmployees.length > 0) ||

    (this.isSelected('visitors') &&
      this.filteredVisitors.length > 0) ||

    (this.isSelected('trainees') &&
      this.filteredTrainees.length > 0) ||

    (this.isSelected('companions') &&
      this.filteredCompanions.length > 0)
  );
  }


  formatDate(value: unknown): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value as string);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString('ar-SA');
  }

  printReport(): void {
    window.print();
  }

  exportReport(): void {
    const reportData: Record<string, any[]> = {};

    if (this.isSelected('employees')) {
      reportData['employees'] = this.filteredEmployees;
    }

    if (this.isSelected('visitors')) {
      reportData['visitors'] = this.filteredVisitors;
    }

    if (this.isSelected('trainees')) {
      reportData['trainees'] = this.filteredTrainees;
    }

    if (this.isSelected('companions')) {
      reportData['companions'] = this.filteredCompanions;
    }

    const fileContent = JSON.stringify(
      reportData,
      null,
      2
    );

    const fileBlob = new Blob(
      [fileContent],
      { type: 'application/json;charset=utf-8' }
    );

    const fileUrl = URL.createObjectURL(fileBlob);
    const downloadLink = document.createElement('a');

    downloadLink.href = fileUrl;
    downloadLink.download =
      `registration-report-${new Date().getTime()}.json`;

    downloadLink.click();

    URL.revokeObjectURL(fileUrl);
  }
}