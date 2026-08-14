import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
class SupabaseService {
  private supabase: SupabaseClient;

  
  private supabaseUrl = 'https://nfznctuiqvtdodzfojki.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mem5jdHVpcXZ0ZG9kemZvamtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjk0OTIsImV4cCI6MjEwMTkwNTQ5Mn0.wxO-TZ4RK4fq11HzfYCIDydZ-7YghaDnU-ijHfMqWpY';

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  /* =========================================
     1. دوال خاصة بالصفحة الرئيسية (Home)
     ========================================= */

  async getLatestOperations(limit: number = 3) {
    const { data, error } = await this.supabase
      .from('registrations') 
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching latest operations:', error);
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
    let query = this.supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false }); 

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reports data:', error);
      throw error;
    }
    return data || [];
  }


  /* =========================================
     3. التحديث الفوري (Realtime Subscription)
     ========================================= */

  onNewRegistration(): Observable<any> {
    return new Observable((observer) => {
      const channel = this.supabase
        .channel('public:registrations')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'registrations' },
          (payload) => {
            observer.next(payload);
          }
        )
        .subscribe();

      return () => {
        this.supabase.removeChannel(channel);
      };
    });
  }
}

export { SupabaseService };