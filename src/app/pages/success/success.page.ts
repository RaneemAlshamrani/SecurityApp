import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonButton, 
    IonIcon
  ],
})
export class SuccessPage {

  constructor(private router: Router) {
    addIcons({ checkmarkCircleOutline, homeOutline });
  }

  goToHome(): void {
    this.router.navigateByUrl('/home');
  }
}