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
  informationCircleOutline
} from 'ionicons/icons';

interface ContactItem {
  title: string;
  desc: string;
  phone: string;
  logo: string;
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
      phone: '06537825514',
      logo: 'assets/images/support-logo.png'
    },
    {
      title: 'إدارة الأمن والسلامة',
      desc: 'للاستفسارات والملاحظات المتعلقة بإجراءات الأمن والسلامة.',
      phone: '0923764362',
      logo: 'assets/images/security-logo.png'
    }
  ];

  constructor() {
    addIcons({
      arrowForwardOutline,
      optionsOutline,
      documentTextOutline,
      chatbubbleOutline,
      callOutline,
      informationCircleOutline
    });
  }
}