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
  IonSelect,
  IonSelectOption,
  IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.page.html',
  styleUrls: ['./register-employee.page.scss'],
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
    IonSelect,
    IonSelectOption,
    IonNote
  ]
})
export class RegisterEmployeePage {

  employeeId = '';
  employeeName = '';
  department = '';
  notes = '';

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

  isEmployeeIdValid(): boolean {
    return /^[0-9]+$/.test(this.employeeId);
  }

  isEmployeeNameValid(): boolean {
    return !/[0-9]/.test(this.employeeName);
  }

  saveEmployee(): void {

    this.submitted = true;

    if (
      !this.employeeId.trim() ||
      !this.isEmployeeIdValid() ||
      !this.employeeName.trim() ||
      !this.isEmployeeNameValid() ||
      !this.department
    ) {
      return;
    }

    this.registrationService.addEmployee({
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      department: this.department,
      notes: this.notes
    });

    this.submitted = false;

    this.router.navigateByUrl('/success');

  }

}