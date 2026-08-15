import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonButton,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonLabel
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  logInOutline,
  timeOutline,
  personOutline,
  briefcaseOutline,
  optionsOutline,
  documentTextOutline,
  chatbubbleOutline,
  logOutOutline
} from 'ionicons/icons';

import { SupabaseService } from '../../services/supabase.services';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonButton,
    IonIcon,
    IonTabBar,
    IonTabButton,
    IonLabel
  ],
})
export class HomePage implements OnInit, OnDestroy {

  currentDateTime = '';

  staffName = 'جاري التحميل...';
  gateNumber = '-';

  latestOperations: any[] = [];

  private dateTimeInterval:
    ReturnType<typeof setInterval>;

  


  constructor(
    private router: Router,
    private authService: AuthService,
    private supabaseService: SupabaseService
  ) {

    addIcons({
      logInOutline,
      timeOutline,
      personOutline,
      briefcaseOutline,
      optionsOutline,
      documentTextOutline,
      chatbubbleOutline,
      logOutOutline
    });


    this.updateDateTime();


    this.dateTimeInterval =
      setInterval(() => {

        this.updateDateTime();

      }, 1000);

  }


  /* =========================================
     تشغيل الصفحة
     ========================================= */

  async ngOnInit(): Promise<void> {

    await this.loadStaffProfile();

    const session =
      await this.authService.getSession();


    if (!session) {

      console.error(
        'لا توجد Session للمستخدم الحالي'
      );

      await this.router.navigateByUrl(
        '/login',
        {
          replaceUrl: true
        }
      );

      return;
    }


    await this.loadLatestOperations();

    

  }


  /* =========================================
     جلب بيانات موظف الأمن
     ========================================= */

  async loadStaffProfile(): Promise<void> {

    try {

      const profile =
        await this.authService
          .getStaffProfile();


      if (!profile) {

        this.staffName =
          'موظف الأمن';

        this.gateNumber =
          '-';

        return;
      }


      this.staffName =
        profile.full_name ||
        'موظف الأمن';


      this.gateNumber =
        profile.gate_number ||
        '-';


      console.log(
        'بيانات موظف الأمن:',
        profile
      );


    } catch (error) {

      console.error(
        'خطأ أثناء تحميل بيانات موظف الأمن:',
        error
      );


      this.staffName =
        'موظف الأمن';

      this.gateNumber =
        '-';

    }

  }


  /* =========================================
     جلب آخر العمليات
     ========================================= */

  async loadLatestOperations(): Promise<void> {

    try {

      this.latestOperations =
        await this.supabaseService
          .getLatestOperations(3);


      console.log(
        'آخر العمليات:',
        this.latestOperations
      );


    } catch (error) {

      console.error(
        'Error fetching latest operations:',
        error
      );


      this.latestOperations = [];

    }

  }


  


  /* =========================================
     أيقونة الفئة
     ========================================= */

  getCategoryIcon(
    category: string
  ): string {

    switch (category) {

      case 'employee':
        return 'briefcase-outline';

      case 'visitor':
        return 'person-outline';

      case 'trainee':
        return 'person-outline';

      case 'companion':
        return 'person-outline';

      default:
        return 'person-outline';

    }

  }


  /* =========================================
     اسم الفئة
     ========================================= */

  getCategoryTitle(
    category: string
  ): string {

    switch (category) {

      case 'employee':
        return 'دخول موظف';

      case 'visitor':
        return 'دخول مراجع';

      case 'trainee':
        return 'دخول متدرب';

      case 'companion':
        return 'دخول مرافق';

      default:
        return 'عملية تسجيل';

    }

  }


  /* =========================================
     التاريخ والوقت
     ========================================= */

  updateDateTime(): void {

    const now =
      new Date();


    const date =
      now.toLocaleDateString(
        'ar-SA-u-ca-gregory',
        {
          timeZone:
            'Asia/Riyadh',

          weekday:
            'long',

          year:
            'numeric',

          month:
            'long',

          day:
            'numeric'
        }
      );


    const time =
      now.toLocaleTimeString(
        'ar-SA',
        {
          timeZone:
            'Asia/Riyadh',

          hour:
            '2-digit',

          minute:
            '2-digit',

          hour12:
            true
        }
      );


    this.currentDateTime =
     ` ${date} - ${time};`

  }


  /* =========================================
     الانتقال للتسجيل
     ========================================= */

  goToEntryMethod(): void {

    this.router.navigateByUrl(
      '/entry-method'
    );

  }


  /* =========================================
     تسجيل الخروج
     ========================================= */

  async onLogout(): Promise<void> {

    await this.authService.logout();

  }


  /* =========================================
     تنسيق التاريخ
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


  /* =========================================
     تنظيف الاشتراكات
     ========================================= */

  ngOnDestroy(): void {

    clearInterval(
      this.dateTimeInterval
    );



  }

}