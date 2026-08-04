import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, optionsOutline, documentTextOutline, chatbubbleOutline, addOutline } from 'ionicons/icons';

import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonItem, IonInput, IonButton, IonLabel, IonIcon,
  IonTabBar, IonTabButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-companion',
  templateUrl: './register-companion.page.html',
  styleUrls: ['./register-companion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonItem, IonInput, IonButton, IonLabel, IonIcon,
    IonTabBar, IonTabButton
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

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {
    addIcons({ arrowForwardOutline, optionsOutline, documentTextOutline, chatbubbleOutline, addOutline });
  }

  addCompanion() {
    this.companions.push({
      name: '',
      nationalId: '',
      visitorName: '',
      visitNumber: '',
      companionType: '',
      department: ''
    });
  }

  save() {
    for (const companion of this.companions) {
      if (
        !companion.name.trim() || !companion.nationalId.trim() ||
        !companion.visitorName.trim() || !companion.visitNumber.trim() ||
        !companion.companionType.trim() || !companion.department.trim()
      ) {
        alert('الرجاء تعبئة جميع الحقول');
        return;
      }
      if (!/^[0-9]+$/.test(companion.nationalId)) {
        alert('رقم الهوية يجب أن يحتوي على أرقام فقط');
        return;
      }
      if (!/^[0-9]+$/.test(companion.visitNumber)) {
        alert('رقم المراجعة يجب أن يحتوي على أرقام فقط');
        return;
      }
      if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(companion.name)) {
        alert('اسم المرافق يجب أن يحتوي على أحرف فقط');
        return;
      }
      if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(companion.visitorName)) {
        alert('اسم المراجع الأساسي يجب أن يحتوي على أحرف فقط');
        return;
      }
      if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(companion.companionType)) {
        alert('نوع المرافق يجب أن يحتوي على أحرف فقط');
        return;
      }
      if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(companion.department)) {
        alert('الإدارة يجب أن تحتوي على أحرف فقط');
        return;
      }
    }

    this.registrationService.addCompanions(this.companions);
    this.router.navigateByUrl('/success');
  }

}