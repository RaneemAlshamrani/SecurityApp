import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  IonHeader,
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
  IonImg
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowForwardOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  checkmarkOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,

  imports: [
    FormsModule,

    IonHeader,
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
    IonImg
  ]
})
export class ResetPasswordPage {

  newPassword = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(
  private authService: AuthService
) {
  addIcons({
    arrowForwardOutline,
    lockClosedOutline,
    shieldCheckmarkOutline,
    checkmarkOutline,
    checkmarkCircleOutline
  });
}

  async savePassword(): Promise<void> {

  this.errorMessage = '';
  this.successMessage = '';

  if (!this.newPassword) {
    this.errorMessage =
      'يرجى إدخال كلمة السر الجديدة';
    return;
  }

  if (this.newPassword.length < 8) {
    this.errorMessage =
      'كلمة السر يجب أن لا تقل عن 8 خانات';
    return;
  }

  if (!this.confirmPassword) {
    this.errorMessage =
      'يرجى تأكيد كلمة السر';
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.errorMessage =
      'كلمتا السر غير متطابقتين';
    return;
  }

  const { error } =
    await this.authService.updatePassword(
      this.newPassword
    );

  if (error) {
    this.errorMessage =
      'تعذر تعيين كلمة السر الجديدة';
    return;
  }

  this.successMessage =
    'تم تعيين كلمة السر الجديدة بنجاح.';
}



}