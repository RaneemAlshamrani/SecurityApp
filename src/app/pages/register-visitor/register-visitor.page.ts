import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, qrCodeOutline } from 'ionicons/icons';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonItem, IonInput, IonTextarea, IonButton, IonCard, IonCardContent,
  IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-register-visitor',
  templateUrl: './register-visitor.page.html',
  styleUrls: ['./register-visitor.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonItem, IonInput, IonTextarea, IonButton, IonCard, IonCardContent,
    IonTabBar, IonTabButton, IonIcon, IonLabel
  ]
})
export class RegisterVisitorPage {

  visitorId = '';
  visitorName = '';
  visitorPhone = '';
  visitorEmail = '';
  employeeName = '';
  visitReason = '';

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {
    addIcons({ arrowForwardOutline, qrCodeOutline });
  }

  async scanBarcode() {
    try {
      const support = await BarcodeScanner.isSupported();
      if (!support.supported) { alert('الجهاز لا يدعم الباركود'); return; }
      const permission = await BarcodeScanner.requestPermissions();
      if (permission.camera !== 'granted') { alert('يرجى السماح باستخدام الكاميرا'); return; }
      const result = await BarcodeScanner.scan();
      if (result.barcodes.length > 0) {
        this.visitorId = result.barcodes[0].displayValue ?? '';
      }
    } catch (error) {
      console.error(error);
      alert('تعذر قراءة الباركود');
    }
  }

  saveVisitor() {
    if (!this.visitorId.trim() || !this.visitorName.trim() || !this.employeeName.trim()) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
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
    this.router.navigateByUrl('/success');
  }

}