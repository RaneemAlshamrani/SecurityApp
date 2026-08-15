import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
class SupabaseService {


  /* =========================================
     1. دوال خاصة بالصفحة الرئيسية (Home)
     ========================================= */

  async getLatestOperations(limit: number = 3) {

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);


    if (error) {

      console.error(
        'Error fetching latest operations:',
        error
      );

      throw error;
    }


    return data || [];
  }


  /* =========================================
     2. دوال خاصة بصفحة التقارير (Reports)
     ========================================= */

  async getReportsData(filters: {
    category?: string;
    startDate?: string;
    endDate?: string;
    searchQuery?: string;
  } = {}) {


    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });


    if (
      filters.category &&
      filters.category !== 'all'
    ) {

      query = query.eq(
        'category',
        filters.category
      );
    }


    if (filters.startDate) {

      query = query.gte(
        'created_at',
        filters.startDate
      );
    }


    if (filters.endDate) {

      query = query.lte(
        'created_at',
        filters.endDate
      );
    }


    if (filters.searchQuery) {

      query = query.ilike(
        'name',
      `%${filters.searchQuery}%`
      );
    }


    const { data, error } =
      await query;


    if (error) {

      console.error(
        'Error fetching reports data:',
        error
      );

      throw error;
    }


    return data || [];
  }


  /* =========================================
     3. التحديث الفوري (Realtime Subscription)
     ========================================= */

  onNewRegistration(): Observable<any> {
  return new Observable((observer) => {

    let channel: any;

    const connectRealtime = async () => {
      try {

        const { data, error } =
          await supabase.auth.getSession();

        if (error) {
          console.error(
            'خطأ أثناء جلب Session للـRealtime:',
            error
          );

          observer.error(error);
          return;
        }

        if (!data.session) {
          console.warn(
            'لا توجد Session، لن يتم تشغيل Realtime'
          );

          return;
        }

        // إعطاء Realtime نفس Access Token الخاص بالمستخدم
        supabase.realtime.setAuth(
          data.session.access_token
        );

        channel = supabase
          .channel('public:registrations')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'registrations'
            },
            (payload) => {
              console.log(
                'Realtime registration:',
                payload
              );

              observer.next(payload);
            }
          )
          .subscribe((status) => {

            console.log(
              'Realtime status:',
              status
            );

          });

      } catch (error) {

        console.error(
          'Realtime connection error:',
          error
        );

        observer.error(error);
      }
    };

    connectRealtime();


    return () => {

      if (channel) {
        supabase.removeChannel(channel);
      }

    };

  });
}

  /* =========================================
     4. إنشاء تسجيل جديد
     ========================================= */

  async createRegistration(data: any) {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();


    if (userError) {

      console.error(
        'خطأ أثناء جلب المستخدم الحالي:',
        userError
      );

      throw userError;
    }


    if (!user) {

      throw new Error(
        'لا يوجد مستخدم مسجل الدخول حاليًا'
      );
    }


    const registrationData = {

      ...data,

      created_by:
        user.id

    };


    console.log(
      'البيانات المرسلة إلى Supabase:',
      registrationData
    );


    const { error } = await supabase
      .from('registrations')
      .insert([
        registrationData
      ]);


    if (error) {

      console.error(
        'خطأ أثناء الحفظ في registrations:',
        error
      );

      throw error;
    }


    return registrationData;
  }


  /* =========================================
     5. جلب الإدارات
     ========================================= */

  async getDepartments() {

    const { data, error } =
      await supabase
        .from('departments')
        .select('id, name')
        .order(
          'name',
          {
            ascending: true
          }
        );


    if (error) {

      console.error(
        'خطأ أثناء جلب الإدارات:',
        error
      );

      throw error;
    }


    return data || [];
  }

}

export { SupabaseService };