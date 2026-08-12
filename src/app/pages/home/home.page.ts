import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth'; // استدعاء خدمة المصادقة

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

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
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

  private dateTimeInterval: ReturnType<typeof setInterval>;

  constructor(
    private router: Router,
    private authService: AuthService
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

    // عرض التاريخ والوقت مباشرة عند فتح الصفحة
    this.updateDateTime();

    // تحديث الوقت تلقائياً كل ثانية
    this.dateTimeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);

  }

  /* =========================
     فحص الجلسة والبيانات عند فتح الصفحة
     ========================= */

  // دورة حياة Ionic: تعمل في كل مرة تدخل فيها الصفحة
  async ionViewWillEnter(): Promise<void> {
    await this.checkSessionAndLoadProfile();
  }

  async ngOnInit(): Promise<void> {}

  async checkSessionAndLoadProfile(): Promise<void> {
    try {
      // 1. التحقق من وجود جلسة نشطة من Supabase
      const session = await this.authService.getSession();

      if (!session) {
        // في حال عدم وجود جلسة (أو حذف التوكن يدوياً)، الطرد للوجن فوراً
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return;
      }

      // 2. جلب بيانات البروفايل في حال كانت الجلسة سليمة
      await this.loadStaffProfile();
    } catch (error) {
      console.error('خطأ في التحقق من الجلسة:', error);
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async loadStaffProfile(): Promise<void> {
    try {
      const profile = await this.authService.getStaffProfile();
      if (profile) {
        this.staffName = profile.full_name;
        this.gateNumber = profile.gate_number;
      } else {
        // إذا تعذر جلب البيانات بالرغم من وجود الجلسة
        await this.authService.logout();
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات البروفايل:', error);
      await this.authService.logout();
    }
  }

  /* =========================
     تسجيل الخروج
     ========================= */

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }

  /* =========================
     تحديث التاريخ والوقت
     ========================= */

  updateDateTime(): void {

    const now = new Date();

    const date = now.toLocaleDateString(
      'ar-SA-u-ca-gregory',
      {
        timeZone: 'Asia/Riyadh',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );

    const time = now.toLocaleTimeString(
      'ar-SA',
      {
        timeZone: 'Asia/Riyadh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    );

    this.currentDateTime = `${date} - ${time}`;

  }

  /* =========================
     الانتقال لصفحة التسجيل
     ========================= */

  goToEntryMethod(): void {

    this.router.navigateByUrl(
      '/entry-method'
    );

  }

  /* =========================
     إيقاف المؤقت عند إغلاق الصفحة
     ========================= */

  ngOnDestroy(): void {

    clearInterval(
      this.dateTimeInterval
    );

  }

}