import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegistrationService } from '../../services/registration.service';

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

import { addIcons } from 'ionicons';

import {
  qrCodeOutline,
  createOutline,
  chevronDownOutline,
  chevronUpOutline,
  arrowForwardOutline,
  addOutline,
  removeCircleOutline,
  optionsOutline,
  documentTextOutline,
  chatbubbleOutline
} from 'ionicons/icons';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonTabBar,
  IonTabButton,
  IonLabel
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-entry-method',
  templateUrl: './entry-method.page.html',
  styleUrls: ['./entry-method.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonTabBar,
    IonTabButton
  ]
})


export class EntryMethodPage {

  showCategories = false;

  submitted = false;


  /* =========================
     الإدارات
     ========================= */

  departments = [
    'الموارد البشرية',
    'الإدارة المالية',
    'تقنية المعلومات',
    'إدارة المشاريع',
    'الاستثمار',
    'الصحة العامة',
    'النظافة',
    'الرقابة',
    'التراخيص',
    'خدمة العملاء',
    'التخطيط الحضري',
    'الأراضي والممتلكات',
    'الإعلام والاتصال المؤسسي',
    'الطوارئ والأزمات'
  ];


  /* =========================
     الموظف
     ========================= */

  employeeId = '';
  employeeName = '';

  // اختيارية
  employeeDepartment = '';

  // إجباري
  cardReason = '';


  /* =========================
     المتدرب
     ========================= */

  traineeName = '';
  traineeNationalId = '';

  // اختيارية
  traineeDepartment = '';

  traineeNotes = '';


  /* =========================
     المراجع
     ========================= */

  visitorId = '';
  visitorName = '';

  // اختياري
  visitorPhone = '';

  visitNumber = '';

  // اختيارية
  visitorDepartment = '';


  /* =========================
     المرافق
     ========================= */

  companions = [
    {
      name: '',
      nationalId: '',
      visitNumber: '',

      // اختياري
      companionType: '',

      // اختيارية
      department: ''
    }
  ];


constructor(
  private router: Router,
  private registrationService: RegistrationService
) {

  addIcons({
    qrCodeOutline,
    createOutline,
    chevronDownOutline,
    chevronUpOutline,
    arrowForwardOutline,
    addOutline,
    removeCircleOutline,
    optionsOutline,
    documentTextOutline,
    chatbubbleOutline
  });

}


  /* =========================
     كل مرة ندخل الصفحة
     نمسح البيانات القديمة
     ========================= */

  ionViewWillEnter(): void {

    this.resetForms();

    this.showCategories = false;

  }


  /* =========================
     تنظيف جميع الحقول
     ========================= */

  resetForms(): void {

    /* الموظف */

    this.employeeId = '';
    this.employeeName = '';
    this.employeeDepartment = '';
    this.cardReason = '';


    /* المتدرب */

    this.traineeName = '';
    this.traineeNationalId = '';
    this.traineeDepartment = '';
    this.traineeNotes = '';


    /* المراجع */

    this.visitorId = '';
    this.visitorName = '';
    this.visitorPhone = '';
    this.visitNumber = '';
    this.visitorDepartment = '';


    /* المرافق */

    this.companions = [
      {
        name: '',
        nationalId: '',
        visitNumber: '',
        companionType: '',
        department: ''
      }
    ];


    /* Validation */

    this.submitted = false;

  }


  /* =========================
     فتح / إغلاق الفئات
     ========================= */

  toggleCategories(): void {

    this.showCategories =
      !this.showCategories;

    this.submitted = false;

  }


  /* =========================
     Barcode
     ========================= */

  async scanBarcode(): Promise<void> {

    try {

      const support =
        await BarcodeScanner.isSupported();


      if (!support.supported) {

        alert(
          'الجهاز لا يدعم قراءة الباركود'
        );

        return;

      }


      const permission =
        await BarcodeScanner.requestPermissions();


      if (
        permission.camera !== 'granted'
      ) {

        alert(
          'يرجى السماح باستخدام الكاميرا'
        );

        return;

      }


      const result =
        await BarcodeScanner.scan();


      if (
        result.barcodes.length > 0
      ) {

        alert(
          'تمت قراءة الباركود بنجاح'
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        'تعذر فتح الكاميرا'
      );

    }

  }


  /* =========================
     Employee Validation
     ========================= */

  isEmployeeIdValid(): boolean {

    return /^[0-9]+$/.test(
      this.employeeId
    );

  }


  isEmployeeNameValid(): boolean {

    return !/[0-9]/.test(
      this.employeeName
    );

  }


  /* =========================
     Save Employee
     ========================= */

  saveEmployee(): void {

    this.submitted = true;


    if (
      !this.employeeId.trim() ||
      !this.isEmployeeIdValid() ||

      !this.employeeName.trim() ||
      !this.isEmployeeNameValid() ||

      !this.cardReason.trim()
    ) {

      return;

    }


    this.registrationService.addEmployee({

      employeeId:
        this.employeeId,

      employeeName:
        this.employeeName,

      department:
        this.employeeDepartment,

      cardReason:
        this.cardReason

    });


    /* تنظيف الخانات بعد التسجيل */

    this.resetForms();


    this.router.navigateByUrl(
      '/success'
    );

  }


  /* =========================
     Trainee Validation
     ========================= */

  isTraineeNameValid(): boolean {

    return !/[0-9]/.test(
      this.traineeName
    );

  }


  isTraineeNationalIdValid(): boolean {

    return /^[0-9]+$/.test(
      this.traineeNationalId
    );

  }


  /* =========================
     Save Trainee
     ========================= */

  saveTrainee(): void {

    this.submitted = true;


    if (
      !this.traineeName.trim() ||
      !this.isTraineeNameValid() ||

      !this.traineeNationalId.trim() ||
      !this.isTraineeNationalIdValid()
    ) {

      return;

    }


    this.registrationService.addTrainee({

      traineeName:
        this.traineeName,

      nationalId:
        this.traineeNationalId,

      department:
        this.traineeDepartment,

      notes:
        this.traineeNotes

    });


    /* تنظيف الخانات بعد التسجيل */

    this.resetForms();


    this.router.navigateByUrl(
      '/success'
    );

  }


  /* =========================
     Visitor Validation
     ========================= */

  isVisitorIdValid(): boolean {

    return /^[0-9]+$/.test(
      this.visitorId
    );

  }


  isVisitorNameValid(): boolean {

    return !/[0-9]/.test(
      this.visitorName
    );

  }


  isVisitorPhoneValid(): boolean {

    return /^[0-9]+$/.test(
      this.visitorPhone
    );

  }


  isVisitNumberValid(): boolean {

    return /^[0-9]+$/.test(
      this.visitNumber
    );

  }


  /* =========================
     Save Visitor
     ========================= */

  saveVisitor(): void {

    this.submitted = true;


    if (
      !this.visitorId.trim() ||
      !this.isVisitorIdValid() ||

      !this.visitorName.trim() ||
      !this.isVisitorNameValid() ||

      (
        this.visitorPhone.trim() &&
        !this.isVisitorPhoneValid()
      ) ||

      !this.visitNumber.trim() ||
      !this.isVisitNumberValid()
    ) {

      return;

    }


    this.registrationService.addVisitor({

      visitorId:
        this.visitorId,

      visitorName:
        this.visitorName,

      visitorPhone:
        this.visitorPhone,

      visitNumber:
        this.visitNumber,

      department:
        this.visitorDepartment

    });


    /* تنظيف الخانات بعد التسجيل */

    this.resetForms();


    this.router.navigateByUrl(
      '/success'
    );

  }


  /* =========================
     إضافة مرافق
     ========================= */

  addCompanion(): void {

    this.companions.push({

      name: '',

      nationalId: '',

      visitNumber: '',

      companionType: '',

      department: ''

    });

  }


  /* =========================
     إزالة مرافق
     ========================= */

  removeCompanion(
    index: number
  ): void {

    if (
      this.companions.length > 1
    ) {

      this.companions.splice(
        index,
        1
      );

    }

  }


  /* =========================
     Save Companions
     ========================= */

  saveCompanions(): void {

    this.submitted = true;


    for (
      const companion
      of this.companions
    ) {

      /*
        الإجباري:
        - اسم المرافق
        - رقم الهوية
        - رقم المراجعة

        الاختياري:
        - نوع المرافق
        - الإدارة
      */

      if (
        !companion.name.trim() ||
        !companion.nationalId.trim() ||
        !companion.visitNumber.trim()
      ) {

        return;

      }


      /* الاسم بدون أرقام */

      if (
        /[0-9]/.test(
          companion.name
        )
      ) {

        return;

      }


      /* الهوية أرقام فقط */

      if (
        !/^[0-9]+$/.test(
          companion.nationalId
        )
      ) {

        return;

      }


      /* رقم المراجعة أرقام فقط */

      if (
        !/^[0-9]+$/.test(
          companion.visitNumber
        )
      ) {

        return;

      }


      /*
        نوع المرافق اختياري
        لكن إذا تمت كتابته
        لا يسمح بالأرقام
      */

      if (
        companion.companionType.trim() &&
        /[0-9]/.test(
          companion.companionType
        )
      ) {

        return;

      }

    }


    this.registrationService.addCompanions(
      this.companions
    );


    /* تنظيف الخانات بعد التسجيل */

    this.resetForms();


    this.router.navigateByUrl(
      '/success'
    );

  }


  /* =========================
     Navigation
     ========================= */

  goToPage(
    path: string
  ): void {

    this.resetForms();

    this.showCategories = false;


    this.router.navigateByUrl(
      path
    );

  }

}