import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { addIcons } from 'ionicons';

import {
  arrowForwardOutline,
  gridOutline,
  barChartOutline,
  callOutline
} from 'ionicons/icons';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
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
  IonSelect,
  IonSelectOption,
  IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-trainee',
  templateUrl: './register-trainee.page.html',
  styleUrls: ['./register-trainee.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
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
    IonSelect,
    IonSelectOption,
    IonNote
  ]
})
export class RegisterTraineePage {

  traineeName = '';
  nationalId = '';
  education = '';
  department = '';
  notes = '';

  submitted = false;

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {

    addIcons({
      arrowForwardOutline,
      gridOutline,
      barChartOutline,
      callOutline
    });

  }

  isTraineeNameValid(): boolean {
    return !/[0-9]/.test(this.traineeName);
  }

  isNationalIdValid(): boolean {
    return /^[0-9]+$/.test(this.nationalId);
  }

  isEducationValid(): boolean {
    return !/[0-9]/.test(this.education);
  }

  save(): void {

    this.submitted = true;

    if (
      !this.traineeName.trim() ||
      !this.isTraineeNameValid() ||
      !this.nationalId.trim() ||
      !this.isNationalIdValid() ||
      !this.education.trim() ||
      !this.isEducationValid() ||
      !this.department
    ) {
      return;
    }

    this.registrationService.addTrainee({

      traineeName: this.traineeName,
      nationalId: this.nationalId,
      education: this.education,
      department: this.department,
      notes: this.notes

    });

    this.submitted = false;

    this.router.navigateByUrl('/success');

  }

}