import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { addIcons } from 'ionicons';

import {
  qrCodeOutline,
  createOutline,
  chevronDownOutline,
  chevronUpOutline,
  arrowForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-entry-method',
  templateUrl: './entry-method.page.html',
  styleUrls: ['./entry-method.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton
  ]
})
export class EntryMethodPage {

  showCategories = false;

  constructor(private router: Router) {

    addIcons({
      qrCodeOutline,
      createOutline,
      chevronDownOutline,
      chevronUpOutline,
      arrowForwardOutline
    });

  }

  async scanBarcode() {

    try {

      const support = await BarcodeScanner.isSupported();

      if (!support.supported) {
        alert('الجهاز لا يدعم قراءة الباركود');
        return;
      }

      const permission = await BarcodeScanner.requestPermissions();

      if (permission.camera !== 'granted') {
        alert('يرجى السماح باستخدام الكاميرا');
        return;
      }

      const result = await BarcodeScanner.scan();

      if (result.barcodes.length > 0) {
        alert('تمت قراءة الباركود بنجاح');
      }

    } catch (error) {

      console.error(error);
      alert('تعذر فتح الكاميرا');

    }

  }

  goToPage(path: string): void {
    this.showCategories = false;
    this.router.navigateByUrl(path);
  }

}