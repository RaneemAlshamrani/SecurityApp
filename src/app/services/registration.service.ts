import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Subject, Observable } from 'rxjs'; // تمت إضافة استيراد Subject و Observable هنا

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private supabase: SupabaseClient;
  
  employees: any[] = [];
  visitors: any[] = [];
  trainees: any[] = [];
  companions: any[] = [];

  private loaded = false;
  private newRegistrationSubject = new Subject<any>();

  constructor(
    private http: HttpClient
  ) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.loadSavedRegistrations();
    this.initRealtimeListener(); // تم تفعيل مستمع التحديثات الحية تلقائياً
  }

  /* =========================================
     استماع التحديثات الحية (Realtime Listener)
     ========================================= */
  private initRealtimeListener() {
    this.supabase
      .channel('public:registrations')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registrations' },
        (payload) => {
          this.newRegistrationSubject.next(payload);
        }
      )
      .subscribe();
  }

  onNewRegistration(): Observable<any> {
    return this.newRegistrationSubject.asObservable();
  }


  /* =========================================
     تحميل البيانات المحفوظة محلياً
     ========================================= */
  private loadSavedRegistrations(): void {
    try {
      this.employees = JSON.parse(localStorage.getItem('employees') || '[]');
      this.visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
      this.trainees = JSON.parse(localStorage.getItem('trainees') || '[]');
      this.companions = JSON.parse(localStorage.getItem('companions') || '[]');
    } catch (error) {
      console.error('خطأ في قراءة البيانات المحفوظة', error);
    }
  }

  private saveRegistrations(): void {
    localStorage.setItem('employees', JSON.stringify(this.employees));
    localStorage.setItem('visitors', JSON.stringify(this.visitors));
    localStorage.setItem('trainees', JSON.stringify(this.trainees));
    localStorage.setItem('companions', JSON.stringify(this.companions));
  }


  /* =========================================
     جلب التقارير لصفحة التقارير
     ========================================= */
  async getReportsData(filters: any = {}): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return this.getAllRegistrations();
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching reports from Supabase:', err);
      return this.getAllRegistrations();
    }
  }


  /* =========================================
     جلب آخر العمليات لصفحة الرئيسية (Home)
     ========================================= */
  async getLatestOperations(limit: number = 3): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching latest operations:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching latest operations:', err);
      return [];
    }
  }


  /* =========================================
     إضافة موظف
     ========================================= */
  async addEmployee(employee: any): Promise<void> {
    const newEmployee = {
      name: employee.employeeName || employee.name || '',
      employee_id: employee.employeeId || null,
      department: employee.department || null,
      card_reason: employee.cardReason || null,
      category: 'employee',
      created_at: new Date().toISOString()
    };

    this.employees.push(newEmployee);
    this.saveRegistrations();

    try {
      const { error } = await this.supabase.from('registrations').insert([newEmployee]);
      if (error) console.error('Supabase Error (Employee):', error);
    } catch (err) {
      console.error('Error inserting employee to Supabase:', err);
    }
  }


  /* =========================================
     إضافة مراجع
     ========================================= */
  async addVisitor(visitor: any): Promise<void> {
    const newVisitor = {
      name: visitor.visitorName || visitor.name || '',
      national_id: visitor.visitorId || visitor.nationalId || null,
      phone: visitor.visitorPhone || visitor.phone || null,
      visit_number: visitor.visitNumber || null,
      department: visitor.department || null,
      category: 'visitor',
      created_at: new Date().toISOString()
    };

    this.visitors.push(newVisitor);
    this.saveRegistrations();

    try {
      const { error } = await this.supabase.from('registrations').insert([newVisitor]);
      if (error) console.error('Supabase Error (Visitor):', error);
    } catch (err) {
      console.error('Error inserting visitor to Supabase:', err);
    }
  }


  /* =========================================
     إضافة متدرب
     ========================================= */
  async addTrainee(trainee: any): Promise<void> {
    const newTrainee = {
      name: trainee.traineeName || trainee.name || '',
      national_id: trainee.nationalId || trainee.national_id || null, 
      department: trainee.department || null,
      category: 'trainee',
      created_at: new Date().toISOString()
    };

    this.trainees.push(newTrainee);
    this.saveRegistrations();

    try {
      const { error } = await this.supabase.from('registrations').insert([newTrainee]);
      if (error) console.error('Supabase Error (Trainee):', error);
    } catch (err) {
      console.error('Error inserting trainee to Supabase:', err);
    }
  }


  /* =========================================
     إضافة مرافق
     ========================================= */
  async addCompanions(companions: any[]): Promise<void> {
    const formattedCompanions: any[] = [];

    companions.forEach(companion => {
      const newCompanion = {
        name: companion.name || '',
        national_id: companion.nationalId || null,
        visit_number: companion.visitNumber || null,
        companion_type: companion.companionType || companion.type || null,
        department: companion.department || null,
        category: 'companion',
        created_at: new Date().toISOString()
      };

      this.companions.push(newCompanion);
      formattedCompanions.push(newCompanion);
    });

    this.saveRegistrations();

    try {
      const { error } = await this.supabase.from('registrations').insert(formattedCompanions);
      if (error) console.error('Supabase Error (Companions):', error);
    } catch (err) {
      console.error('Error inserting companions to Supabase:', err);
    }
  }

  loadInitialData() {
    console.log('تم استدعاء بيانات التهيئة الأولية للتسجيل');
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

      this.saveRegistrations();
    }

    console.log('تم تسجيل موظف الباركود:', data);
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
      ...this.employees.map(e => ({ ...e, type: 'موظف' })),
      ...this.visitors.map(v => ({ ...v, type: 'مراجع' })),
      ...this.trainees.map(t => ({ ...t, type: 'متدرب' })),
      ...this.companions.map(c => ({ ...c, type: 'مرافق' }))
    ];
  }

}