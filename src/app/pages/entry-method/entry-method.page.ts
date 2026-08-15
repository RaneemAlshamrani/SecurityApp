import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegistrationService } from '../../services/registration.service';
import { SupabaseService } from '../../services/supabase.services';

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

  departments: { id: string; name: string }[] = [];

  /* =========================
     الموظف
     ========================= */

  employeeId = '';
  employeeName = '';

  employeeDepartment = '';

  cardReason = '';

  /* =========================
     المتدرب
     ========================= */

  traineeName = '';
  traineeNationalId = '';

  traineeDepartment = '';

  traineeNotes = '';

  /* =========================
     المراجع
     ========================= */

  visitorId = '';
  visitorName = '';

  visitorPhone = '';

  visitNumber = '';

  visitorDepartment = '';

  /* =========================
     المرافق
     ========================= */

  companions = [
    {
      name: '',
      nationalId: '',
      visitNumber: '',
      companionType: '',
      department: ''
    }
  ];

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private supabaseService: SupabaseService
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
     عند دخول الصفحة
     ========================= */

  async ionViewWillEnter(): Promise<void> {

    this.resetForms();

    this.showCategories = false;

    await this.loadDepartments();
  }

  /* =========================
     تحميل الإدارات من Supabase
     ========================= */

  private async loadDepartments(): Promise<void> {

    try {

      this.departments =
        await this.supabaseService.getDepartments();

      console.log(
        'الإدارات من Supabase:',
        this.departments
      );

    } catch (error) {

      console.error(
        'فشل تحميل الإدارات:',
        error
      );

      this.departments = [];
    }
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

  async saveEmployee(): Promise<void> {

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

    try {

      await this.registrationService.addEmployee({

        employeeId:
          this.employeeId,

        employeeName:
          this.employeeName,

        department:
          this.employeeDepartment,

        cardReason:
          this.cardReason

      });

      this.resetForms();

      this.router.navigateByUrl(
        '/success'
      );

    } catch (error) {

      console.error(
        'فشل تسجيل الموظف:',
        error
      );

      alert(
        'حدث خطأ أثناء حفظ التسجيل. لم يتم حفظ البيانات.'
      );
    }
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

  async saveTrainee(): Promise<void> {

    this.submitted = true;

    if (
      !this.traineeName.trim() ||
      !this.isTraineeNameValid() ||

      !this.traineeNationalId.trim() ||
      !this.isTraineeNationalIdValid()
    ) {

      return;

    }

    try {

      await this.registrationService.addTrainee({

        traineeName:
          this.traineeName,

        nationalId:
          this.traineeNationalId,

        department:
          this.traineeDepartment,

        notes:
          this.traineeNotes

      });

      this.resetForms();

      this.router.navigateByUrl(
        '/success'
      );

    } catch (error) {

      console.error(
        'فشل تسجيل المتدرب:',
        error
      );

      alert(
        'حدث خطأ أثناء حفظ التسجيل. لم يتم حفظ البيانات.'
      );
    }
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

  async saveVisitor(): Promise<void> {

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

    try {

      await this.registrationService.addVisitor({

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

      this.resetForms();

      this.router.navigateByUrl('/success');

    } catch (error) {

      console.error(
        'فشل حفظ المراجع في Supabase:',
        error
      );

      alert(
        'حدث خطأ أثناء حفظ التسجيل. لم يتم حفظ البيانات.'
      );
    }
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

  async saveCompanions(): Promise<void> {

    this.submitted = true;

    for (
      const companion
      of this.companions
    ) {

      if (
        !companion.name.trim() ||
        !companion.nationalId.trim() ||
        !companion.visitNumber.trim()
      ) {

        return;

      }

      if (
        /[0-9]/.test(
          companion.name
        )
      ) {

        return;

      }

      if (
        !/^[0-9]+$/.test(
          companion.nationalId
        )
      ) {

        return;

      }

      if (
        !/^[0-9]+$/.test(
          companion.visitNumber
        )
      ) {

        return;

      }

      if (
        companion.companionType.trim() &&
        /[0-9]/.test(
          companion.companionType
        )
      ) {

        return;

      }

    }

    try {

      await this.registrationService.addCompanions(
        this.companions
      );

      this.resetForms();

      this.router.navigateByUrl(
        '/success'
      );

    } catch (error) {

      console.error(
        'فشل تسجيل المرافقين:',
        error
      );

      alert(
        'حدث خطأ أثناء حفظ التسجيل. لم يتم حفظ البيانات.'
      );
    }
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