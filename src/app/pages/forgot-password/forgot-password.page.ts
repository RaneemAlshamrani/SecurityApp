import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonRouterLink,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonText,
  IonNote,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonInput,
  IonIcon,
  IonLabel,
  IonButton,
  IonSpinner,
  IonImg
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowForwardOutline,
  mailOutline,
  paperPlaneOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,

  imports: [
    FormsModule,
    RouterLink,

    IonHeader,
    IonRouterLink,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar,
    IonText,
    IonNote,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    IonLabel,
    IonButton,
    IonSpinner,
    IonImg
  ]
})
export class ForgotPasswordPage {

  email = '';

  errorMessage = '';
  successMessage = '';

  isLoading = false;

  constructor(
    private authService: AuthService
  ) {
    addIcons({
      arrowForwardOutline,
      mailOutline,
      paperPlaneOutline,
      checkmarkCircleOutline
    });
  }

  async sendResetLink(): Promise<void> {

    this.errorMessage = '';
    this.successMessage = '';

    const normalizedEmail =
      this.email.trim().toLowerCase();

    if (!normalizedEmail) {
      this.errorMessage =
        'يرجى إدخال عنوان البريد الإلكتروني';
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      this.errorMessage =
        'يرجى إدخال بريد إلكتروني صحيح';
      return;
    }

    this.isLoading = true;

    try {

      // 1. التحقق أن البريد مرتبط بحساب موظف
      const {
        data,
        error
      } =
        await this.authService
          .checkStaffEmail(normalizedEmail);

      if (error) {
        this.errorMessage =
          'حدث خطأ أثناء التحقق من البريد الإلكتروني';
        return;
      }

      if (!data?.exists) {
        this.errorMessage =
          'البريد الإلكتروني غير صحيح';
        return;
      }

      // 2. إرسال رابط تغيير كلمة السر
      const {
        error: resetError
      } =
        await this.authService
          .resetPassword(normalizedEmail);

      if (resetError) {
        this.errorMessage =
          'تعذر إرسال رابط استعادة كلمة السر';
        return;
      }

      this.successMessage =
        'تم إرسال رابط استعادة كلمة السر إلى بريدك الإلكتروني.';

    } catch {
      this.errorMessage =
        'حدث خطأ، يرجى المحاولة مرة أخرى';
    }

    finally {
      this.isLoading = false;
    }
  }
}