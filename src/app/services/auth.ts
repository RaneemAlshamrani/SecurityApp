import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { supabase } from './supabase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private router: Router
  ) {}


  /* =========================================
     تسجيل الدخول باسم المستخدم
     ========================================= */

  async loginByUsername(
    username: string,
    password: string,
    rememberMe: boolean = false
  ) {

    const { data, error } =
      await supabase.functions.invoke(
        'login-by-username',
        {
          body: {
            username:
              username
                .trim()
                .toLowerCase(),

            password
          }
        }
      );


    if (
      error ||
      data?.error
    ) {

      throw new Error(
        data?.error ||
        'اسم المستخدم أو كلمة المرور غير صحيحة'
      );
    }


    /* تعيين الجلسة بعد نجاح الدخول */

    if (data?.session) {

      await supabase.auth.setSession(
        data.session
      );

    }


    if (!rememberMe) {

      window.addEventListener(
        'beforeunload',
        () => {

          supabase.auth.signOut();

        }
      );

    }


    return data;
  }


  /* =========================================
     تسجيل الدخول بالإيميل
     ========================================= */

  async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ) {

    const { data, error } =
      await supabase.auth
        .signInWithPassword({
          email,
          password
        });


    if (error) {

      throw error;

    }


    if (!rememberMe) {

      window.addEventListener(
        'beforeunload',
        () => {

          supabase.auth.signOut();

        }
      );

    }


    return data;
  }


  /* =========================================
     جلب بيانات موظف الأمن
     ========================================= */

  async getStaffProfile() {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();


    if (userError) {

      console.error(
        'خطأ أثناء جلب المستخدم:',
        userError
      );

      return null;
    }


    if (!user) {

      return null;

    }


    const { data, error } =
      await supabase
        .from('security_staff_profiles')
        .select(
          'full_name, gate_number'
        )
        .eq(
          'id',
          user.id
        )
        .single();


    if (error) {

      console.error(
        'خطأ أثناء جلب بيانات موظف الأمن:',
        error
      );

      return null;
    }


    return data;
  }


  /* =========================================
     جلب الـ Session
     ========================================= */

  async getSession() {

    const { data } =
      await supabase.auth.getSession();


    return data.session;
  }


  /* =========================================
     تسجيل الخروج
     ========================================= */

  async logout() {

    await supabase.auth.signOut();


    await this.router.navigateByUrl(
      '/login',
      {
        replaceUrl: true
      }
    );

  }

}