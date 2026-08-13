import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  employees: any[] = [];
  visitors: any[] = [];
  trainees: any[] = [];
  companions: any[] = [];

  private loaded = false;

private supabase: SupabaseClient;

constructor(
  private http: HttpClient
) {
  this.supabase = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  this.loadSavedRegistrations();
}

  /* =========================================
     تحميل البيانات المحفوظة
     ========================================= */

  private loadSavedRegistrations(): void {

    try {

      this.employees =
        JSON.parse(
          localStorage.getItem('employees') || '[]'
        );

      this.visitors =
        JSON.parse(
          localStorage.getItem('visitors') || '[]'
        );

      this.trainees =
        JSON.parse(
          localStorage.getItem('trainees') || '[]'
        );

      this.companions =
        JSON.parse(
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


  /* =========================================
     حفظ البيانات
     ========================================= */

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


  /* =========================================
     تحميل بيانات JSON
     ========================================= */

  loadInitialData(): void {

    if (this.loaded) {
      return;
    }

    this.loaded = true;

    this.http
      .get<any>('assets/data/mock-data.json')
      .subscribe({

        next: (data) => {

          /*
            نستخدم الـJSON كبيانات أولية فقط.

            إذا عندنا بيانات محفوظة بالفعل
            ما نستبدلها.
          */

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


  /* =========================================
     موظف
     ========================================= */

  addEmployee(employee: any): void {

    const newEmployee = {
      ...employee,
      time: new Date().toISOString()
    };

    this.employees.push(
      newEmployee
    );

    this.saveRegistrations();

    console.log(
      'تم تسجيل موظف:',
      newEmployee
    );

  }


  /* =========================================
     مراجع
     ========================================= */

  addVisitor(visitor: any): void {

    const newVisitor = {
      ...visitor,
      time: new Date().toISOString()
    };

    this.visitors.push(
      newVisitor
    );

    this.saveRegistrations();

    console.log(
      'تم تسجيل مراجع:',
      newVisitor
    );

  }


  /* =========================================
     متدرب
     ========================================= */

  addTrainee(trainee: any): void {

    const newTrainee = {
      ...trainee,
      time: new Date().toISOString()
    };

    this.trainees.push(
      newTrainee
    );

    this.saveRegistrations();

    console.log(
      'تم تسجيل متدرب:',
      newTrainee
    );

  }


  /* =========================================
     مرافق
     ========================================= */

  addCompanions(companions: any[]): void {

    companions.forEach(companion => {

      const newCompanion = {
        ...companion,
        time: new Date().toISOString()
      };

      this.companions.push(
        newCompanion
      );

    });

    this.saveRegistrations();

    console.log(
      'تم تسجيل المرافقين:',
      this.companions
    );

  }


/* =========================================
   تسجيل موظف عن طريق الباركود
   ========================================= */
async addBarcodeEmployee(): Promise<boolean> {

const now = new Date().toISOString();

const { data: { user } } = await this.supabase.auth.getUser();

if (!user) {
  console.error('لا يوجد مستخدم مسجل دخول');
  return false;
}

const barcodeEmployee = {
  category: 'employee',
  name: 'أحمد محمد',
  employee_id: '10025',
  department_id: 4,
  department: 'إدارة المشاريع',
  national_id: '4567891234',
  card_reason: 'دخول عبر الباركود',
  created_by: user.id,
  created_at: now
};


  const { data, error } =
    await this.supabase
      .from('registrations')
      .insert(barcodeEmployee)
      .select()
      .single();

  if (error) {

    console.error(
      'خطأ في تسجيل موظف الباركود:',
      JSON.stringify(error)
    );

    return false;
  }

  // منع تكرار نفس التسجيل في القائمة المحلية
const alreadyExists = this.employees.some(
  employee => employee.id === data.id
);

if (!alreadyExists) {

  this.employees.push({
    ...data,
    time: data.created_at
  });

  // حفظ التسجيل محليًا حتى يظهر في التقارير
  this.saveRegistrations();

}

console.log(
  'تم تسجيل موظف الباركود:',
  data
);

return true;
}

async loadEmployeesFromSupabase(): Promise<void> {

  const { data, error } = await this.supabase
    .from('registrations')
    .select('*')
    .eq('category', 'employee');

  if (error) {
    console.error(
      'خطأ في تحميل الموظفين من Supabase:',
      JSON.stringify(error)
    );
    return;
  }

  const supabaseEmployees = (data ?? []).map(employee => ({
    ...employee,
    time: employee.time || employee.created_at
  }));

  const allEmployees = [
    ...this.employees,
    ...supabaseEmployees
  ];

this.employees = allEmployees.filter(
  (employee, index, self) =>
    index === self.findIndex(
      e => e.employee_id === employee.employee_id
    )
);

  this.saveRegistrations();
}

  /* =========================================
     كل التسجيلات
     ========================================= */

  getAllRegistrations(): any[] {

    return [

      ...this.employees.map(employee => ({
        ...employee,
        type: 'موظف'
      })),

      ...this.visitors.map(visitor => ({
        ...visitor,
        type: 'مراجع'
      })),

      ...this.trainees.map(trainee => ({
        ...trainee,
        type: 'متدرب'
      })),

      ...this.companions.map(companion => ({
        ...companion,
        type: 'مرافق'
      }))

    ];

  }

}