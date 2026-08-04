import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonCheckbox,
  IonText
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
    IonContent, 
    IonItem, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonCheckbox,
    IonText
  ],
})
export class LoginPage {
  username = '';
  password = '';
  rememberMe = false;
  errorMessage = ''; // error validation state

  constructor(private router: Router) {
    addIcons({ personOutline, lockClosedOutline });
  }

  login(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    // reset error state
    this.errorMessage = '';

    // validation checks
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

    // mock route transition
    this.router.navigateByUrl('/home');
  }
}