import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { optionsOutline, documentTextOutline, chatbubbleOutline } from 'ionicons/icons';
import {
  Router,
  RouterModule
} from '@angular/router';

import {
  SupabaseService
} from '../../services/supabase.services';


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

  fromDate = '2026-08-01';
  toDate = '2026-08-14';

  dateError = '';

  selectedCategories: string[] = [
    'employees',
    'visitors',
    'trainees',
    'companions'
  ];

  // أضفنا مصفوفة لتخزين السجلات القادمة من قاعدة البيانات
  records: any[] = [];


  constructor(
  public supabaseService:
    SupabaseService,

  private router:
    Router
) {
  addIcons({ optionsOutline, documentTextOutline, chatbubbleOutline });
}

  // يتم جلب البيانات تلقائياً أول ما تدخل الصفحة
  async ionViewWillEnter() {
    await this.fetchRecords();
  }

  // دالة لجلب البيانات من جدول registrations في Supabase
  // دالة لجلب البيانات باستخدام خدمة Supabase الجاهزة
  async fetchRecords() {
    try {
      // استخدام دالة getReportsData المعرفة مسبقاً في الـ SupabaseService
      const data = await this.supabaseService.getReportsData();
      if (data) {
        this.records = data;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }


  /* =========================================
     العدادات (تم ربطها بمصفوفة السجلات الحقيقية)
     ========================================= */

  get employeesCount(): number {
    return this.records.filter(item => 
      item.category === 'employees' || item.category === 'employee' || item.category === 'موظف'
    ).length;
  }

  get visitorsCount(): number {
    return this.records.filter(item => 
      item.category === 'visitors' || item.category === 'visitor' || item.category === 'مراجع'
    ).length;
  }

  get traineesCount(): number {
    return this.records.filter(item => 
      item.category === 'trainees' || item.category === 'trainee' || item.category === 'متدرب'
    ).length;
  }

  get companionsCount(): number {
    return this.records.filter(item => 
      item.category === 'companions' || item.category === 'companion' || item.category === 'مرافق'
    ).length;
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