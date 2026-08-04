import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, qrCodeOutline, optionsOutline, documentTextOutline, chatbubbleOutline } from 'ionicons/icons';

import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonItem, IonInput, IonButton, IonCard, IonCardContent,
  IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-register-trainee',
  templateUrl: './register-trainee.page.html',
  styleUrls: ['./register-trainee.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonItem, IonInput, IonButton, IonCard, IonCardContent,
    IonTabBar, IonTabButton, IonIcon, IonLabel
  ]
})
export class RegisterTraineePage {

  traineeName = '';
  nationalId = '';
  education = '';
  department = '';

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {
    addIcons({ arrowForwardOutline, qrCodeOutline, optionsOutline, documentTextOutline, chatbubbleOutline });
  }

  async scanBarcode() {
    try {
      const permissions = await BarcodeScanner.requestPermissions();
      if (permissions.camera !== 'granted') { alert('يرجى السماح باستخدام الكاميرا'); return; }
      const result = await BarcodeScanner.scan();
      if (result.barcodes.length > 0) {
        this.nationalId = result.barcodes[0].rawValue ?? result.barcodes[0].displayValue ?? '';
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء مسح الباركود');
    }
  }

  save() {
    if (!this.traineeName.trim() || !this.nationalId.trim() || !this.education.trim() || !this.department.trim()) {
      alert('الرجاء تعبئة جميع الحقول');
      return;
    }

    if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(this.traineeName)) {
      alert('اسم المتدرب يجب أن يحتوي على أحرف فقط');
      return;
    }
    if (!/^[0-9]+$/.test(this.nationalId)) {
      alert('رقم الهوية يجب أن يحتوي على أرقام فقط');
      return;
    }
    if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(this.education)) {
      alert('الجهة التعليمية يجب أن تحتوي على أحرف فقط');
      return;
    }
    if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(this.department)) {
      alert('الإدارة يجب أن تحتوي على أحرف فقط');
      return;
    }

    this.registrationService.addTrainee({
      traineeName: this.traineeName,
      nationalId: this.nationalId,
      education: this.education,
      department: this.department
    });

    this.router.navigateByUrl('/success');
  }

}