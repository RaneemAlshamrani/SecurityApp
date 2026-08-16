import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import {
  SupabaseService
} from '../../services/supabase.services';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  documentTextOutline,
  documentOutline,
  peopleOutline,
  personOutline,
  schoolOutline,
  personAddOutline,
  downloadOutline,
  printOutline,
  optionsOutline,
  chatbubbleOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

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

  // المتغيرات لاسم الموظف ورقم البوابة
  staffName = 'موظف النظام (قسم الأمن)';
  gateNumber = '3';
  printTime = '';

  issueDate =
    new Date()
      .toLocaleString('ar-SA');

  private allData: any[] = [];


  constructor(

    public supabaseService:
      SupabaseService,

    private activatedRoute:
      ActivatedRoute

  ) {

    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      documentTextOutline,
      documentOutline,
      peopleOutline,
      personOutline,
      schoolOutline,
      personAddOutline,
      downloadOutline,
      printOutline,
      optionsOutline,
      chatbubbleOutline,
      eyeOutline,
      eyeOffOutline
    });

  }


  /* =========================================
     عند دخول التقرير
     ========================================= */

  async ionViewWillEnter(): Promise<void> {

    this.loadSelectedCategories();

    this.issueDate =
      new Date()
        .toLocaleString('ar-SA');

    // تحديث وقت الإصدار بالصيغة المحلية المناسبة للترويسة
    this.printTime = new Date().toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // جلب بيانات الملف الشخصي (الاسم والبوابة) من Supabase تماماً مثل الصفحة الرئيسية
    await this.loadUserProfile();

    // استدعاء دالة جلب البيانات من Supabase عند دخول الصفحة
    await this.fetchDataFromSupabase();

  }


  /* =========================================
     جلب بيانات الملف الشخصي (الاسم والبوابة)
     ========================================= */
  async loadUserProfile() {
    try {
      const client = (this.supabaseService as any).supabase;
      if (!client) return;

      const { data: { user } } = await client.auth.getUser();

      if (user) {
        // الاستعلام باستخدام الأعمدة المطلوبة: full_name و gate_number
        const { data: profile, error } = await client
          .from('security_staff_profiles')
          .select('full_name, gate_number')
          .eq('id', user.id)
          .single();

        if (profile && !error) {
          this.staffName = profile.full_name || 'موظف الأمن';
          this.issuerName = this.staffName;
          this.gateNumber = profile.gate_number || '-';
        } else {
          this.staffName = user.email || 'مسؤول النظام';
          this.issuerName = this.staffName;
          this.gateNumber = '-';
        }
      } else {
        this.staffName = 'زائر';
        this.issuerName = this.staffName;
        this.gateNumber = '-';
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.staffName = 'موظف النظام (قسم الأمن)';
      this.gateNumber = '3';
    }
  }


  /* =========================================
     جلب البيانات من Supabase Service مع الترتيب
     ========================================= */

  private async fetchDataFromSupabase(): Promise<void> {

  try {

    const data =
      await this.supabaseService
        .getReportsData({});

    console.log('REPORT DATA FROM SUPABASE:', data);

    if (
      data &&
      Array.isArray(data)
    ) {

      this.allData =
        data.sort((a, b) => {

          const dateA =
            new Date(
              b.created_at ||
              b.time ||
              0
            ).getTime();

          const dateB =
            new Date(
              a.created_at ||
              a.time ||
              0
            ).getTime();

          return dateA - dateB;

        });

    } else {

      this.allData = [];

    }

    console.log(
      'ALL DATA:',
      this.allData
    );

    console.log(
      'EMPLOYEES:',
      this.employees
    );

    console.log(
      'VISITORS:',
      this.visitors
    );

  } catch (error) {

    console.error(
      'Error fetching report data:',
      error
    );

    this.allData = [];

  }

}

  /* =========================================
     تقسيم البيانات القادمة حسب الفئات
     ========================================= */

  get employees(): any[] {
    return this.allData.filter(item => item.category === 'employee' || item.category === 'employees');
  }

  get visitors(): any[] {
    return this.allData.filter(item => item.category === 'visitor' || item.category === 'visitors');
  }

  get trainees(): any[] {
    return this.allData.filter(item => item.category === 'trainee' || item.category === 'trainees');
  }

  get companions(): any[] {
    return this.allData.filter(item => item.category === 'companion' || item.category === 'companions');
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


console.log(
  'REPORT FILTER DATES:',
  this.fromDate,
  this.toDate
);


    return rows.filter(row => {

      const rowDate =
        new Date(row.time || row.created_at);

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

  /* =========================================
     إخفاء / إظهار رقم الهوية
     ========================================= */

  private revealedIds = new Set<string>();

  toggleIdVisibility(key: string): void {

    if (this.revealedIds.has(key)) {

      this.revealedIds.delete(key);

    } else {

      this.revealedIds.add(key);

    }

  }

  isIdRevealed(key: string): boolean {

    return this.revealedIds.has(key);

  }

  maskNationalId(value: unknown): string {

    if (!value) {
      return '-';
    }
    const strVal = String(value);
    if (strVal.length > 4) {
      return '••••' + strVal.slice(-4);
    }
    return '••••••••••';

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