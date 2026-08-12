import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase: SupabaseClient;

  constructor() {
  this.supabase = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );
}

  // إرسال رابط إعادة تعيين كلمة السر للإيميل
  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://172.20.10.3:8100/reset-password'
    });
  }

  // حفظ كلمة السر الجديدة
  async updatePassword(newPassword: string) {
    return await this.supabase.auth.updateUser({
      password: newPassword
    });
  }
async checkStaffEmail(email: string) {
  return await this.supabase.functions.invoke(
    'check-staff-email',
    {
      body: {
        email: email
      }
    }
  );
}

}