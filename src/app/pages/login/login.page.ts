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
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

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
  showPassword = false; // متغير إظهار وإخفاء كلمة المرور

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async ionViewWillEnter(): Promise<void> {
    try {
      // تحويل للهوم مباشرة لو فيه توكن محفوط
      const session = await this.authService.getSession();
      if (session) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    } catch (e) {}
  }

  async login(event?: Event): Promise<void> {
    if (event) event.preventDefault();

    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'يرجى إدخال اسم المستخدم';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'يرجى إدخال كلمة المرور';
      return;
    }

    try {
      // إرسال الاسم بدلاً من الإيميل
      await this.authService.loginByUsername(this.username, this.password, this.rememberMe);
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
  }

  openForgotPassword(): void {
    this.router.navigateByUrl('/forgot-password');
  }

}