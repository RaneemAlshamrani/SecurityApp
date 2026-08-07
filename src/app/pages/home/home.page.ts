import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  logInOutline,
  timeOutline,
  personOutline,
  briefcaseOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon
  ],
})
export class HomePage {

  constructor(private router: Router) {

    addIcons({
      logInOutline,
      timeOutline,
      personOutline,
      briefcaseOutline
    });

  }

  goToEntryMethod(): void {
    this.router.navigateByUrl('/entry-method');
  }

}