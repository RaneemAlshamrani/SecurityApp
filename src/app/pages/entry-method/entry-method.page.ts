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
  IonBackButton
} from '@ionic/angular/standalone';

import { ActionSheetController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { addIcons } from 'ionicons';

import {
  qrCodeOutline,
  createOutline
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
    IonBackButton
  ]
})
export class EntryMethodPage {

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {

    addIcons({
      qrCodeOutline,
      createOutline
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

  async chooseCategory() {

    const sheet = await this.actionSheetCtrl.create({

      header: 'اختر فئة الدخول',

      buttons: [

        {
          text: '👨‍💼 موظف',
          handler: () => this.router.navigateByUrl('/register-employee')
        },

        {
          text: '👤 مراجع',
          handler: () => this.router.navigateByUrl('/register-visitor')
        },

        {
          text: '🎓 متدرب',
          handler: () => this.router.navigateByUrl('/register-trainee')
        },

        {
          text: '👥 مرافق',
          handler: () => this.router.navigateByUrl('/register-companion')
        },

        {
          text: 'إلغاء',
          role: 'cancel'
        }

      ]

    });

    await sheet.present();

  }

}