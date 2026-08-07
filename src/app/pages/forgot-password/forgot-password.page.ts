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
    IonText,
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

  constructor() {
    addIcons({
      arrowForwardOutline,
      mailOutline,
      paperPlaneOutline,
      checkmarkCircleOutline
    });
  }

  sendResetLink(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const normalizedEmail = this.email.trim();

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

    // مؤقت إلى أن يتم ربط Supabase
    setTimeout(() => {
      this.isLoading = false;

      this.successMessage =
        'تم إرسال رابط استعادة كلمة السر إلى بريدك الإلكتروني.';
    }, 800);
  }
}