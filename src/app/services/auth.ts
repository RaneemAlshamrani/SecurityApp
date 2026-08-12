import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL ='https://nfznctuiqvtdodzfojki.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mem5jdHVpcXZ0ZG9kemZvamtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjk0OTIsImV4cCI6MjEwMTkwNTQ5Mn0.wxO-TZ4RK4fq11HzfYCIDydZ-7YghaDnU-ijHfMqWpY';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  // 1. دالة تسجيل الدخول مع استقبال معامل "تذكرني"
  async login(email: string, password: string, rememberMe: boolean = false) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // إذا لم يُفعَّل خيار "تذكرني"، يتم مسح الجلسة فور إغلاق تبويب المتصفح
    if (!rememberMe) {
      window.addEventListener('beforeunload', () => {
        this.supabase.auth.signOut();
      });
    }

    return data;
  }

  // 2. دالة جلب بيانات موظف الأمن (الاسم ورقم البوابة)
  async getStaffProfile() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('security_staff_profiles')
      .select('full_name, gate_number')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return data;
  }

  // 3. التحقق من وجود الجلسة الحالية (Session)
  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  // 4. تسجيل الخروج وإعادة التوجيه لصفحة اللوجن
  async logout() {
    await this.supabase.auth.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}