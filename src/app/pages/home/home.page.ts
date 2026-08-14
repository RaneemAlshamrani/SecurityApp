import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth'; // استدعاء خدمة المصادقة
import { CommonModule } from '@angular/common'; // مهم جداً لدعم *ngFor و async pipe

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

// استيراد خدمة Supabase الخاصة بك (تأكد من مطابقة مسار الملف)
import { SupabaseService } from 'src/app/services/supabase.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // أُضيف هنا لدعم *ngFor والتنسيقات
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

  latestOperations: any[] = []; // مصفوفة آخر العمليات الفعلية من Supabase
  
  private dateTimeInterval: ReturnType<typeof setInterval>;
  private realtimeSub?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private supabaseService: SupabaseService // حقن خدمة سوبابيس (تمت إضافة الفاصلة الناقصة هنا)
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

  // تم وضع استدعاء الدوال هنا داخل دالة ngOnInit النظامية
  ngOnInit() {
    this.loadLatestOperations();
    this.setupRealtimeSubscription();
  }


  /* =========================
     جلب آخر العمليات من Supabase
     ========================= */
  async loadLatestOperations() {
    try {
      this.latestOperations = await this.supabaseService.getLatestOperations(3); // جلب آخر 3 عمليات كما هو في التصميم
    } catch (error) {
      console.error('Error fetching latest operations:', error);
    }
  }


  /* =========================
     التحديث الفوري (Realtime)
     ========================= */
  setupRealtimeSubscription() {
    this.realtimeSub = this.supabaseService.onNewRegistration().subscribe((payload: any) => {
      // إضافة التسجيل الجديد فوراً وإبقائه في حدود آخر 3 عمليات
      this.latestOperations = [payload.new, ...this.latestOperations].slice(0, 3);
    });
  }


  /* =========================
     دوال مساعدة للأيقونات والمسميات
     ========================= */
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'employee': return 'briefcase-outline';
      case 'visitor': return 'person-outline';
      case 'trainee': return 'person-outline';
      default: return 'person-outline';
    }
  }

  getCategoryTitle(category: string): string {
    switch (category) {
      case 'employee': return 'دخول موظف';
      case 'visitor': return 'دخول مراجع';
      case 'trainee': return 'دخول متدرب';
      case 'companion': return 'دخول مرافق';
      default: return 'عملية تسجيل';
    }
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
    this.router.navigateByUrl('/entry-method');
  }

onLogout(): void {
    this.router.navigateByUrl('/login');
  }
  /* =========================================
     تنسيق التاريخ والوقت (مضاف حديثاً لمنع الأخطاء)
     ========================================= */
  formatDate(value: unknown): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value as string);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleString(
      'ar-SA',
      {
        timeZone: 'Asia/Riyadh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    );
  }

  /* =========================
     إيقاف المؤقتات عند إغلاق الصفحة
     ========================= */
  ngOnDestroy(): void {
    clearInterval(this.dateTimeInterval);
    if (this.realtimeSub) {
      this.realtimeSub.unsubscribe();
    }
  }

}