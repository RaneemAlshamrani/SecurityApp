import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline,arrowForwardOutline, qrCodeOutline } from 'ionicons/icons';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonItem, IonInput, IonTextarea, IonButton, IonCard, IonCardContent,
  IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.page.html',
  styleUrls: ['./register-employee.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonItem, IonInput, IonTextarea, IonButton, IonCard, IonCardContent,
    IonTabBar, IonTabButton, IonIcon, IonLabel
  ]
})
export class RegisterEmployeePage {

  employeeId = '';
  employeeName = '';
  department = '';
  notes = '';

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {
    addIcons({ arrowBackOutline, arrowForwardOutline ,qrCodeOutline });
  }

  async scanBarcode() {
    try {
      const support = await BarcodeScanner.isSupported();
      if (!support.supported) { alert('الجهاز لا يدعم الباركود'); return; }
      const permission = await BarcodeScanner.requestPermissions();
      if (permission.camera !== 'granted') { alert('يرجى السماح باستخدام الكاميرا'); return; }
      const result = await BarcodeScanner.scan();
      if (result.barcodes.length > 0) {
        this.employeeId = result.barcodes[0].displayValue ?? '';
      }
    } catch (error) {
      console.error(error);
      alert('تعذر قراءة الباركود');
    }
  }

  saveEmployee() {
    if (!this.employeeId.trim() || !this.employeeName.trim() || !this.department.trim()) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }
    this.registrationService.addEmployee({
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      department: this.department,
      notes: this.notes
    });
    this.router.navigateByUrl('/success');
  }

}