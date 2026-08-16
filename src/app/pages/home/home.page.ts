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

import { SupabaseService } from 'src/app/services/supabase.services';
import { Subscription } from 'rxjs';

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
  
  private dateTimeInterval: ReturnType<typeof setInterval>;
  private realtimeSub?: Subscription;

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

    this.dateTimeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);

  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadLatestOperations();
    this.setupRealtimeSubscription();
  }


  /* =========================
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
          this.gateNumber = profile.gate_number || '-';
        } else {
          this.staffName = user.email || 'مسؤول النظام';
          this.gateNumber = '-';
        }
      } else {
        this.staffName = 'زائر';
        this.gateNumber = '-';
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.staffName = 'خطأ في التحميل';
    }
  }


  /* =========================
     جلب آخر العمليات من Supabase
     ========================================= */
  async loadLatestOperations() {
    try {
      this.latestOperations = await this.supabaseService.getLatestOperations(3);
    } catch (error) {
      console.error('Error fetching latest operations:', error);
    }
  }


  /* =========================
     التحديث الفوري (Realtime)
     ========================================= */
  setupRealtimeSubscription() {
    this.realtimeSub = this.supabaseService.onNewRegistration().subscribe((payload: any) => {
      this.latestOperations = [payload.new, ...this.latestOperations].slice(0, 3);
    });
  }


  /* =========================
     دوال مساعدة للأيقونات والمسميات
     ========================================= */
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
     ========================================= */
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
     الانتقال لصفحة التسجيل والخروج
     ========================================= */
  goToEntryMethod(): void {
    this.router.navigateByUrl('/entry-method');
  }

  onLogout(): void {
    this.router.navigateByUrl('/login');
  }


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


  ngOnDestroy(): void {
    clearInterval(this.dateTimeInterval);
    if (this.realtimeSub) {
      this.realtimeSub.unsubscribe();
    }
  }

}