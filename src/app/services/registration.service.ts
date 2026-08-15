import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SupabaseService } from './supabase.services';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  employees: any[] = [];
  visitors: any[] = [];
  trainees: any[] = [];
  companions: any[] = [];

  private loaded = false;

  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService
  ) {
    this.loadSavedRegistrations();
  }

  private loadSavedRegistrations(): void {
    try {
      this.employees = JSON.parse(
        localStorage.getItem('employees') || '[]'
      );

      this.visitors = JSON.parse(
        localStorage.getItem('visitors') || '[]'
      );

      this.trainees = JSON.parse(
        localStorage.getItem('trainees') || '[]'
      );

      this.companions = JSON.parse(
        localStorage.getItem('companions') || '[]'
      );

    } catch (error) {
      console.error(
        'خطأ في قراءة البيانات المحفوظة',
        error
      );

      this.employees = [];
      this.visitors = [];
      this.trainees = [];
      this.companions = [];
    }
  }

  private saveRegistrations(): void {
    localStorage.setItem(
      'employees',
      JSON.stringify(this.employees)
    );

    localStorage.setItem(
      'visitors',
      JSON.stringify(this.visitors)
    );

    localStorage.setItem(
      'trainees',
      JSON.stringify(this.trainees)
    );

    localStorage.setItem(
      'companions',
      JSON.stringify(this.companions)
    );
  }

  loadInitialData(): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    this.http
      .get<any>('assets/data/mock-data.json')
      .subscribe({
        next: (data) => {

          if (this.employees.length === 0) {
            this.employees = [
              ...(data.employees ?? [])
            ];
          }

          if (this.visitors.length === 0) {
            this.visitors = [
              ...(data.visitors ?? [])
            ];
          }

          if (this.trainees.length === 0) {
            this.trainees = [
              ...(data.trainees ?? [])
            ];
          }

          if (this.companions.length === 0) {
            this.companions = [
              ...(data.companions ?? [])
            ];
          }

          this.saveRegistrations();
        },

        error: (error) => {
          console.error(
            'تعذر تحميل البيانات الأولية',
            error
          );
        }
      });
  }

  /* =========================
     الموظف
     ========================= */

  async addEmployee(
    employee: any
  ): Promise<void> {

    const newEmployee = {
      category: 'employee',

      employee_id:
        employee.employeeId,

      name:
        employee.employeeName,

      card_reason:
        employee.cardReason,

      phone: null,

      visit_number: null,

      department_id:
        employee.department || null,

      notes:
        employee.notes || null,

      companion_type: null,

      created_at:
        new Date().toISOString(),

      national_id: null,

      
    };

    try {
      const result =
        await this.supabaseService
          .createRegistration(
            newEmployee
          );

      console.log(
        'تم حفظ الموظف في Supabase:',
        result
      );

      const localEmployee = {
        ...employee,
        time: new Date().toISOString()
      };

      this.employees.push(
        localEmployee
      );

      this.saveRegistrations();

    } catch (error) {
      console.error(
        'فشل تسجيل الموظف:',
        error
      );

      throw error;
    }
  }

  /* =========================
     المراجع
     ========================= */

  async addVisitor(
    visitor: any
  ): Promise<void> {

    const visitorId =
      visitor.visitorId
        ? String(visitor.visitorId)
        : '';

    const newVisitor = {
      category: 'visitor',

      name:
        visitor.visitorName,

      phone:
        visitor.visitorPhone || null,

      national_id:
        visitorId || null,

      visit_number:
        visitor.visitNumber,

      department_id:
        visitor.department || null,

      employee_id: null,

      card_reason: null,

      notes:
        visitor.notes || null,

      companion_type: null,

      created_at:
        new Date().toISOString(),


    };

    try {
      const result =
        await this.supabaseService
          .createRegistration(
            newVisitor
          );

      console.log(
        'تم حفظ المراجع في Supabase:',
        result
      );

      const localVisitor = {
        ...visitor,
        time: new Date().toISOString()
      };

      this.visitors.push(
        localVisitor
      );

      this.saveRegistrations();

    } catch (error) {
      console.error(
        'فشل حفظ المراجع:',
        error
      );

      throw error;
    }
  }

  /* =========================
     المتدرب
     ========================= */

  async addTrainee(
    trainee: any
  ): Promise<void> {

    const traineeId =
      trainee.nationalId
        ? String(trainee.nationalId)
        : '';

    const newTrainee = {
      category: 'trainee',

      name:
        trainee.traineeName,

      phone:
        trainee.traineePhone || null,

      national_id:
        traineeId || null,



      visit_number:
        trainee.visitNumber || null,

      department_id:
        trainee.department || null,

      employee_id: null,

      card_reason: null,

      notes:
        trainee.notes || null,

      companion_type: null,

      created_at:
        new Date().toISOString()
    };

    try {
      const result =
        await this.supabaseService
          .createRegistration(
            newTrainee
          );

      console.log(
        'تم حفظ المتدرب في Supabase:',
        result
      );

      const localTrainee = {
        ...trainee,
        time: new Date().toISOString()
      };

      this.trainees.push(
        localTrainee
      );

      this.saveRegistrations();

    } catch (error) {
      console.error(
        'فشل تسجيل المتدرب:',
        error
      );

      throw error;
    }
  }

  /* =========================
     المرافقون
     ========================= */

  async addCompanions(
    companions: any[]
  ): Promise<void> {

    try {

      for (const companion of companions) {

        const nationalId =
          companion.nationalId
            ? String(companion.nationalId)
            : '';

        const newCompanion = {
          category: 'companion',

          name:
            companion.name,

          phone:
            companion.phone || null,

          national_id:
            nationalId || null,


          visit_number:
            companion.visitNumber,

          department_id:
            companion.department || null,

          employee_id: null,

          card_reason: null,

          notes:
            companion.notes || null,

          companion_type:
            companion.companionType || null,

          created_at:
            new Date().toISOString()
        };

        const result =
          await this.supabaseService
            .createRegistration(
              newCompanion
            );

        console.log(
          'تم حفظ المرافق في Supabase:',
          result
        );

        const localCompanion = {
          ...companion,
          time: new Date().toISOString()
        };

        this.companions.push(
          localCompanion
        );
      }

      this.saveRegistrations();

      console.log(
        'تم تسجيل المرافقين:',
        this.companions
      );

    } catch (error) {
      console.error(
        'فشل تسجيل المرافقين:',
        error
      );

      throw error;
    }
  }

/* =========================
   تسجيل موظف عن طريق الباركود
   ========================= */

async addBarcodeEmployee(): Promise<boolean> {

  const barcodeEmployee = {

    category: 'employee',

    employee_id: '10025',

    name: 'أحمد محمد',

    card_reason: 'دخول عبر الباركود',

    phone: null,

    visit_number: null,

    department_id: 4,

    notes: null,

    companion_type: null,

    national_id: '4567891234',

    created_at:
      new Date().toISOString()
  };

  try {

    const result =
      await this.supabaseService
        .createRegistration(
          barcodeEmployee
        );

    console.log(
      'تم تسجيل موظف الباركود في Supabase:',
      result
    );

    const localEmployee = {

      ...barcodeEmployee,

      employeeId:
        barcodeEmployee.employee_id,

      employeeName:
        barcodeEmployee.name,

      department:
        barcodeEmployee.department_id,

      cardReason:
        barcodeEmployee.card_reason,

      time:
        barcodeEmployee.created_at
    };

    this.employees.push(
      localEmployee
    );

    this.saveRegistrations();

    return true;

} catch (error: any) {

  console.error(
    'فشل تسجيل موظف الباركود - code:',
    error?.code
  );

  console.error(
    'فشل تسجيل موظف الباركود - message:',
    error?.message
  );

  console.error(
    'فشل تسجيل موظف الباركود - details:',
    error?.details
  );

  console.error(
    'فشل تسجيل موظف الباركود - hint:',
    error?.hint
  );

  alert(
    `خطأ: ${error?.message || 'خطأ غير معروف'}`
  );

  return false;
}
}

  getAllRegistrations(): any[] {

    return [

      ...this.employees.map(
        employee => ({
          ...employee,
          type: 'موظف'
        })
      ),

      ...this.visitors.map(
        visitor => ({
          ...visitor,
          type: 'مراجع'
        })
      ),

      ...this.trainees.map(
        trainee => ({
          ...trainee,
          type: 'متدرب'
        })
      ),

      ...this.companions.map(
        companion => ({
          ...companion,
          type: 'مرافق'
        })
      )

    ];
  }
}