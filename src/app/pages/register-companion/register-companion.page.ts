import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { addIcons } from 'ionicons';

import {
  arrowForwardOutline,
  optionsOutline,
  documentTextOutline,
  chatbubbleOutline,
  addOutline,
  removeCircleOutline
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
  IonButton,
  IonLabel,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonSelect,
  IonSelectOption,
  IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-companion',
  templateUrl: './register-companion.page.html',
  styleUrls: ['./register-companion.page.scss'],
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
    IonButton,
    IonLabel,
    IonIcon,
    IonTabBar,
    IonTabButton,
    IonSelect,
    IonSelectOption,
    IonNote
  ]
})

export class RegisterCompanionPage {

  companions = [
    {
      name: '',
      nationalId: '',
      visitorName: '',
      visitNumber: '',
      companionType: '',
      department: ''
    }
  ];

  submitted = false;

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {

    addIcons({
      arrowForwardOutline,
      optionsOutline,
      documentTextOutline,
      chatbubbleOutline,
      addOutline,
      removeCircleOutline
    });

  }

  addCompanion(): void {

    this.companions.push({
      name: '',
      nationalId: '',
      visitorName: '',
      visitNumber: '',
      companionType: '',
      department: ''
    });

  }

  removeCompanion(index: number): void {

    if (this.companions.length > 1) {
      this.companions.splice(index, 1);
    }

  }

  save(): void {

    this.submitted = true;

    for (const companion of this.companions) {

      if (
        !companion.name.trim() ||
        !companion.nationalId.trim() ||
        !companion.visitorName.trim() ||
        !companion.visitNumber.trim() ||
        !companion.companionType.trim() ||
        !companion.department
      ) {
        return;
      }

      if (!/^[0-9]+$/.test(companion.nationalId)) {
        return;
      }

      if (!/^[0-9]+$/.test(companion.visitNumber)) {
        return;
      }

      if (/[0-9]/.test(companion.name)) {
        return;
      }

      if (/[0-9]/.test(companion.visitorName)) {
        return;
      }

      if (/[0-9]/.test(companion.companionType)) {
        return;
      }

    }

    this.registrationService.addCompanions(this.companions);

    this.submitted = false;

    this.router.navigateByUrl('/success');

  }

}