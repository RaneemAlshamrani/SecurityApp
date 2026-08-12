import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonText,
  IonCard,
  IonImg
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonText,
    IonCard,
    IonImg
  ],
})
export class LoginPage {

  username = '';
  password = '';
  rememberMe = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({
      personOutline,
      lockClosedOutline
    });
  }

  // التعديل 1: الفحص التلقائي فور فتح الصفحة وقبل عرض الواجهة
  async ionViewWillEnter(): Promise<void> {
    try {
      const session = await this.authService.getSession();
      if (session) {
        // إذا كان هناك جلسة نشطة، تحويل الموظف فوراً للهوم بدون عرض اللوجن
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    } catch (e) {
      // لا توجد جلسة نشطة، البقاء في صفحة اللوجن
    }
  }

  async login(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'يرجى إدخال البريد الإلكتروني';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'يرجى إدخال كلمة المرور';
      return;
    }

    try {
      // التعديل 2: تمرير متغير rememberMe مع بيانات الدخول
      await this.authService.login(this.username.trim(), this.password, this.rememberMe);
      
      // الانتقال للـ Home بعد نجاح الدخول
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      this.errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
  }

  openForgotPassword(): void {
    this.router.navigateByUrl('/forgot-password');
  }
}