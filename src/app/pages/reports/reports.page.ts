import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  Router,
  RouterModule
} from '@angular/router';

import {
  RegistrationService
} from '../../services/registration.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})

export class ReportsPage {

  fromDate = '2026-07-24';
  toDate = '2026-07-27';

  dateError = '';

  selectedCategories: string[] = [
    'employees',
    'visitors',
    'trainees',
    'companions'
  ];


  constructor(
    public registrationService:
      RegistrationService,

    private router:
      Router
  ) {}


  /* =========================================
     العدادات
     تقرأ مباشرة من الـService
     ========================================= */

  get employeesCount(): number {

    return this.registrationService
      .employees
      .length;

  }


  get visitorsCount(): number {

    return this.registrationService
      .visitors
      .length;

  }


  get traineesCount(): number {

    return this.registrationService
      .trainees
      .length;

  }


  get companionsCount(): number {

    return this.registrationService
      .companions
      .length;

  }


  get totalCount(): number {

    return (
      this.employeesCount +
      this.visitorsCount +
      this.traineesCount +
      this.companionsCount
    );

  }


  /* =========================================
     عرض التقرير
     ========================================= */

  showReport(): void {

    this.dateError = '';

    if (
      this.fromDate &&
      this.toDate
    ) {

      const startDate =
        new Date(
          this.fromDate
        );

      const endDate =
        new Date(
          this.toDate
        );

      if (
        startDate > endDate
      ) {

        this.dateError =
          'تاريخ البداية يجب أن يكون قبل تاريخ النهاية أو مساويًا له.';

        return;

      }

    }


    if (
      this.selectedCategories.length === 0
    ) {

      return;

    }


    this.router.navigate(
      ['/report-table'],
      {
        queryParams: {

          categories:
            this.selectedCategories
              .join(','),

          fromDate:
            this.fromDate,

          toDate:
            this.toDate

        }
      }
    );

  }

}