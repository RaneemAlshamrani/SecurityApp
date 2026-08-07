import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

import {
  personOutline,
  lockClosedOutline
} from 'ionicons/icons';

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

  constructor(private router: Router) {
    addIcons({
      personOutline,
      lockClosedOutline
    });
  }

  login(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'يرجى إدخال اسم المستخدم';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'يرجى إدخال كلمة المرور';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'كلمة المرور يجب أن لا تقل عن 8 خانات';
      return;
    }

    this.router.navigateByUrl('/home');
  }

  openForgotPassword(): void {
    this.router.navigateByUrl('/forgot-password');
  }
}