import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  arrowForwardOutline,
  gridOutline,
  barChartOutline,
  callOutline
} from 'ionicons/icons';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-visitor',
  templateUrl: './register-visitor.page.html',
  styleUrls: ['./register-visitor.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonNote
  ]
})
export class RegisterVisitorPage {

  visitorId = '';
  visitorName = '';
  visitorPhone = '';
  visitorEmail = '';
  employeeName = '';
  visitReason = '';

  submitted = false;

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {

    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      gridOutline,
      barChartOutline,
      callOutline
    });

  }

  isVisitorIdValid(): boolean {
    return /^[0-9]+$/.test(this.visitorId);
  }

  isVisitorNameValid(): boolean {
    return !/[0-9]/.test(this.visitorName);
  }

  isVisitorPhoneValid(): boolean {
    return /^[0-9]+$/.test(this.visitorPhone);
  }

  isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.visitorEmail);
  }

  isEmployeeNameValid(): boolean {
    return !/[0-9]/.test(this.employeeName);
  }

  isVisitReasonValid(): boolean {
    return !/[0-9]/.test(this.visitReason);
  }

  saveVisitor(): void {

    this.submitted = true;

    if (
      !this.visitorId.trim() ||
      !this.isVisitorIdValid() ||

      !this.visitorName.trim() ||
      !this.isVisitorNameValid() ||

      !this.visitorPhone.trim() ||
      !this.isVisitorPhoneValid() ||

      !this.visitorEmail.trim() ||
      !this.isEmailValid() ||

      !this.employeeName.trim() ||
      !this.isEmployeeNameValid() ||

      !this.visitReason.trim() ||
      !this.isVisitReasonValid()
    ) {
      return;
    }

    this.registrationService.addVisitor({

      visitorId: this.visitorId,
      visitorName: this.visitorName,
      visitorPhone: this.visitorPhone,
      visitorEmail: this.visitorEmail,
      employeeName: this.employeeName,
      visitReason: this.visitReason

    });

    this.submitted = false;

    this.router.navigateByUrl('/success');

  }

}