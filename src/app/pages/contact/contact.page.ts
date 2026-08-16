import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonFooter
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowForwardOutline,
  optionsOutline,
  documentTextOutline,
  chatbubbleOutline,
  callOutline,
  informationCircleOutline,
  headsetOutline,
  shieldCheckmarkOutline,
  logoWhatsapp
} from 'ionicons/icons';

interface ContactItem {
  title: string;
  desc: string;
  phone: string;
  callLink: string;
  whatsappLink: string;
  icon: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonFooter
  ]
})
export class ContactPage {

  contacts: ContactItem[] = [
    {
      title: 'الدعم الفني',
      desc: 'لحل المشكلات التقنية والاستفسارات المتعلقة باستخدام النظام.',
      phone: '0126149999',
      callLink: 'tel:0126149999',
      whatsappLink: 'https://wa.me/966126149999',
      icon: 'headset-outline'
    },
    {
      title: 'إدارة الأمن والسلامة',
      desc: 'للاستفسارات والملاحظات المتعلقة بإجراءات الأمن والسلامة.',
      phone: '0126149999',
      callLink: 'tel:0126149999',
      whatsappLink: 'https://wa.me/966126149999',
      icon: 'shield-checkmark-outline'
    }
  ];

  constructor() {
    addIcons({
      arrowForwardOutline,
      optionsOutline,
      documentTextOutline,
      chatbubbleOutline,
      callOutline,
      informationCircleOutline,
      headsetOutline,
      shieldCheckmarkOutline,
      logoWhatsapp
    });
  }
}