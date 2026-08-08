import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import {
  RegistrationService
} from '../../services/registration.service';


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

  currentDate =
    new Date().toISOString();

  searchTerm = '';

  selectedCategories: string[] = [
    'employees',
    'visitors',
    'trainees',
    'companions'
  ];

  fromDate = '';
  toDate = '';

  issuerName =
    'موظف النظام (قسم الأمن)';

  issuerId =
    'EMP-9082';

  issueDate =
    new Date()
      .toLocaleString('ar-SA');


  constructor(

    public registrationService:
      RegistrationService,

    private activatedRoute:
      ActivatedRoute

  ) {}


  /* =========================================
     عند دخول التقرير
     ========================================= */

  ionViewWillEnter(): void {

    this.loadSelectedCategories();

    this.issueDate =
      new Date()
        .toLocaleString('ar-SA');

  }


  /* =========================================
     نقرأ البيانات مباشرة من Service
     ========================================= */

  get employees(): any[] {

    return (
      this.registrationService
        .employees ?? []
    );

  }


  get visitors(): any[] {

    return (
      this.registrationService
        .visitors ?? []
    );

  }


  get trainees(): any[] {

    return (
      this.registrationService
        .trainees ?? []
    );

  }


  get companions(): any[] {

    return (
      this.registrationService
        .companions ?? []
    );

  }


  /* =========================================
     الفئات والتاريخ
     ========================================= */

  private loadSelectedCategories(): void {

    const categories =
      this.activatedRoute
        .snapshot
        .queryParamMap
        .get('categories');


    const fromDate =
      this.activatedRoute
        .snapshot
        .queryParamMap
        .get('fromDate');


    const toDate =
      this.activatedRoute
        .snapshot
        .queryParamMap
        .get('toDate');


    if (categories) {

      this.selectedCategories =
        categories
          .split(',')
          .filter(
            category =>
              category
                .trim()
                .length > 0
          );

    }


    if (fromDate) {

      this.fromDate =
        fromDate;

    }


    if (toDate) {

      this.toDate =
        toDate;

    }

  }


  isSelected(
    category: string
  ): boolean {

    return this.selectedCategories
      .includes(category);

  }


  /* =========================================
     Filter
     ========================================= */

  private filterRows(
    rows: any[]
  ): any[] {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    return rows.filter(row => {

      const rowDate =
        new Date(row.time);


      let matchesDate =
        true;


      if (
        !Number.isNaN(
          rowDate.getTime()
        )
      ) {

        if (this.fromDate) {

          const startDate =
            new Date(
              this.fromDate +
              'T00:00:00'
            );


          matchesDate =
            matchesDate &&
            rowDate >= startDate;

        }


        if (this.toDate) {

          const endDate =
            new Date(
              this.toDate +
              'T23:59:59.999'
            );


          matchesDate =
            matchesDate &&
            rowDate <= endDate;

        }

      }


      const matchesSearch =

        !term ||

        JSON.stringify(row)
          .toLowerCase()
          .includes(term);


      return (
        matchesDate &&
        matchesSearch
      );

    });

  }


  get filteredEmployees(): any[] {

    return this.filterRows(
      this.employees
    );

  }


  get filteredVisitors(): any[] {

    return this.filterRows(
      this.visitors
    );

  }


  get filteredTrainees(): any[] {

    return this.filterRows(
      this.trainees
    );

  }


  get filteredCompanions(): any[] {

    return this.filterRows(
      this.companions
    );

  }


  get hasAnyData(): boolean {

    return (

      (
        this.isSelected('employees') &&
        this.filteredEmployees.length > 0
      )

      ||

      (
        this.isSelected('visitors') &&
        this.filteredVisitors.length > 0
      )

      ||

      (
        this.isSelected('trainees') &&
        this.filteredTrainees.length > 0
      )

      ||

      (
        this.isSelected('companions') &&
        this.filteredCompanions.length > 0
      )

    );

  }


  /* =========================================
     وقت التسجيل
     ========================================= */

  formatDate(
    value: unknown
  ): string {

    if (!value) {

      return '-';

    }


    const date =
      new Date(
        value as string
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return '-';

    }


    return date.toLocaleString(
      'ar-SA',
      {
        timeZone:
          'Asia/Riyadh',

        year:
          'numeric',

        month:
          '2-digit',

        day:
          '2-digit',

        hour:
          '2-digit',

        minute:
          '2-digit',

        second:
          '2-digit'
      }
    );

  }


  printReport(): void {

    window.print();

  }


  exportReport(): void {

    this.issueDate =
      new Date()
        .toLocaleString(
          'ar-SA'
        );


    setTimeout(() => {

      window.print();

    }, 300);

  }

}