import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';

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

  // رسالة خطأ التاريخ
  dateError = '';

  selectedCategories: string[] = [
    'employees',
    'visitors',
    'trainees',
    'companions'
  ];

  totalCount = 0;
  employeesCount = 0;
  visitorsCount = 0;
  traineesCount = 0;
  companionsCount = 0;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  ionViewWillEnter(): void {
    this.updateCounts();
  }

  private updateCounts(): void {
    this.employeesCount =
      this.registrationService.employees.length;

    this.visitorsCount =
      this.registrationService.visitors.length;

    this.traineesCount =
      this.registrationService.trainees.length;

    this.companionsCount =
      this.registrationService.companions.length;

    this.totalCount =
      this.employeesCount +
      this.visitorsCount +
      this.traineesCount +
      this.companionsCount;
  }

  showReport(): void {

    // إعادة ضبط رسالة الخطأ
    this.dateError = '';

    // التحقق من صحة التاريخ
    if (this.fromDate && this.toDate) {
      const startDate = new Date(this.fromDate);
      const endDate = new Date(this.toDate);

      if (startDate > endDate) {
        this.dateError =
          'تاريخ البداية يجب أن يكون قبل تاريخ النهاية أو مساويًا له.';
        return;
      }
    }

    // التحقق من اختيار الفئات
    if (this.selectedCategories.length === 0) {
      return;
    }

    // الانتقال إلى صفحة التقرير
    this.router.navigate(['/report-table'], {
      queryParams: {
        categories: this.selectedCategories.join(','),
        fromDate: this.fromDate,
        toDate: this.toDate
      }
    });
  }
}