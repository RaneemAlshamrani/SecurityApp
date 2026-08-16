import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SupabaseService } from 'src/app/services/supabase.services';

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
      const client = (this.supabaseService as any).supabase;
      if (!client) return this.getAllRegistrations();

      const { data, error } = await client
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
      const client = (this.supabaseService as any).supabase;
      if (!client) return [];

      const { data, error } = await client
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
     دالة مساعده لجلب معلومات المستخدم الحالي
     ========================================= */
  private async getCurrentUserInfo() {
    try {
      const client = (this.supabaseService as any).supabase;
      if (!client) return { userId: null, departmentId: null };

      const { data: { user } } = await client.auth.getUser();
      if (!user) return { userId: null, departmentId: null };

      const { data: profile } = await client
        .from('security_staff_profiles')
        .select('department_id')
        .eq('id', user.id)
        .single();

      return {
        userId: user.id,
        departmentId: profile?.department_id || null
      };
    } catch (e) {
      return { userId: null, departmentId: null };
    }
  }

  /* =========================================
     تحميل البيانات الأولية (Mock Data)
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
          if (this.employees.length === 0) {
            this.employees = [...(data.employees ?? [])];
          }

          if (this.visitors.length === 0) {
            this.visitors = [...(data.visitors ?? [])];
          }

          if (this.trainees.length === 0) {
            this.trainees = [...(data.trainees ?? [])];
          }

          if (this.companions.length === 0) {
            this.companions = [...(data.companions ?? [])];
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
     إضافة موظف
     ========================================= */
  async addEmployee(employee: any): Promise<void> {
    const { userId, departmentId } = await this.getCurrentUserInfo();

    const newEmployee = {
      category: 'employee',
      employee_id: employee.employeeId || employee.employee_id || null,
      name: employee.employeeName || employee.name || '',
      card_reason: employee.cardReason || employee.card_reason || null,
      phone: null,
      visit_number: null,
      department_id: employee.department || departmentId || null,
      notes: employee.notes || null,
      companion_type: null,
      created_by: userId,
      national_id: null,
      created_at: new Date().toISOString(),
    };

    try {
      const result = await this.supabaseService.createRegistration(newEmployee);
      console.log('تم حفظ الموظف في Supabase:', result);

      const localEmployee = {
        ...employee,
        time: new Date().toISOString()
      };

      this.employees.push(localEmployee);
      this.saveRegistrations();

    } catch (error) {
      console.error('فشل تسجيل الموظف:', error);
      throw error;
    }
  }

  /* =========================================
     إضافة مراجع
     ========================================= */
  async addVisitor(visitor: any): Promise<void> {
    const { userId, departmentId } = await this.getCurrentUserInfo();
    const visitorId = visitor.visitorId || visitor.nationalId ? String(visitor.visitorId || visitor.nationalId) : '';

    const newVisitor = {
      category: 'visitor',
      name: visitor.visitorName || visitor.name || '',
      phone: visitor.visitorPhone || visitor.phone || null,
      national_id: visitorId || null,
      visit_number: visitor.visitNumber || null,
      department_id: visitor.department || departmentId || null,
      employee_id: null,
      card_reason: null,
      notes: visitor.notes || null,
      companion_type: null,
      created_by: userId,
      created_at: new Date().toISOString(),
    };

    try {
      const result = await this.supabaseService.createRegistration(newVisitor);
      console.log('تم حفظ المراجع في Supabase:', result);

      const localVisitor = {
        ...visitor,
        time: new Date().toISOString()
      };

      this.visitors.push(localVisitor);
      this.saveRegistrations();

    } catch (error) {
      console.error('فشل حفظ المراجع:', error);
      throw error;
    }
  }

  /* =========================================
     إضافة متدرب
     ========================================= */
  async addTrainee(trainee: any): Promise<void> {
    const { userId, departmentId } = await this.getCurrentUserInfo();
    const traineeId = trainee.nationalId || trainee.national_id ? String(trainee.nationalId || trainee.national_id) : '';

    const newTrainee = {
      category: 'trainee',
      name: trainee.traineeName || trainee.name || '',
      phone: trainee.traineePhone || trainee.phone || null,
      national_id: traineeId || null,
      visit_number: trainee.visitNumber || null,
      department_id: trainee.department || departmentId || null,
      employee_id: null,
      card_reason: null,
      notes: trainee.notes || null,
      companion_type: null,
      created_by: userId,
      created_at: new Date().toISOString()
    };

    try {
      const result = await this.supabaseService.createRegistration(newTrainee);
      console.log('تم حفظ المتدرب في Supabase:', result);

      const localTrainee = {
        ...trainee,
        time: new Date().toISOString()
      };

      this.trainees.push(localTrainee);
      this.saveRegistrations();

    } catch (error) {
      console.error('فشل تسجيل المتدرب:', error);
      throw error;
    }
  }

  /* =========================================
     إضافة مرافقون
     ========================================= */
  async addCompanions(companions: any[]): Promise<void> {
    const { userId, departmentId } = await this.getCurrentUserInfo();

    try {
      for (const companion of companions) {
        const nationalId = companion.nationalId ? String(companion.nationalId) : '';

        const newCompanion = {
          category: 'companion',
          name: companion.name || '',
          phone: companion.phone || null,
          national_id: nationalId || null,
          visit_number: companion.visitNumber || null,
          department_id: companion.department || departmentId || null,
          employee_id: null,
          card_reason: null,
          notes: companion.notes || null,
          companion_type: companion.companionType || companion.type || null,
          created_by: userId,
          created_at: new Date().toISOString()
        };

        const result = await this.supabaseService.createRegistration(newCompanion);
        console.log('تم حفظ المرافق في Supabase:', result);

        const localCompanion = {
          ...companion,
          time: new Date().toISOString()
        };

        this.companions.push(localCompanion);
      }

      this.saveRegistrations();
      console.log('تم تسجيل المرافقين:', this.companions);

    } catch (error) {
      console.error('فشل تسجيل المرافقين:', error);
      throw error;
    }
  }

  /* =========================================
     تسجيل موظف عن طريق الباركود
     ========================================= */
  async addBarcodeEmployee(): Promise<boolean> {
    const { userId, departmentId } = await this.getCurrentUserInfo();

    const barcodeEmployee = {
      category: 'employee',
      employee_id: '10025',
      name: 'أحمد محمد',
      card_reason: 'دخول عبر الباركود',
      phone: null,
      visit_number: null,
      department_id: departmentId || 4,
      notes: null,
      companion_type: null,
      national_id: '4567891234',
      created_by: userId || null,
      created_at: new Date().toISOString()
    };

    try {
      const result = await this.supabaseService.createRegistration(barcodeEmployee);
      console.log('تم تسجيل موظف الباركود في Supabase:', result);

      const localEmployee = {
        ...barcodeEmployee,
        employeeId: barcodeEmployee.employee_id,
        employeeName: barcodeEmployee.name,
        department: barcodeEmployee.department_id,
        cardReason: barcodeEmployee.card_reason,
        time: barcodeEmployee.created_at
      };

      this.employees.push(localEmployee);
      this.saveRegistrations();

      return true;

    } catch (error: any) {
      console.error('فشل تسجيل موظف الباركود - message:', error?.message);
      alert(`خطأ: ${error?.message || 'خطأ غير معروف'}`);
      return false;
    }
  }

  /* =========================================
     جلب كافة التسجيلات محلياً
     ========================================= */
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