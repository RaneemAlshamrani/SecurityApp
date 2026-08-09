import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
  chatbubbleOutline
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
export class HomePage implements OnDestroy {

  currentDateTime = '';

  private dateTimeInterval: ReturnType<typeof setInterval>;

  constructor(private router: Router) {

    addIcons({
      logInOutline,
      timeOutline,
      personOutline,
      briefcaseOutline,
      optionsOutline,
      documentTextOutline,
      chatbubbleOutline
    });

    // عرض التاريخ والوقت مباشرة عند فتح الصفحة
    this.updateDateTime();

    // تحديث الوقت تلقائياً كل ثانية
    this.dateTimeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);

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

    this.currentDateTime =
      `${date} - ${time}`;

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