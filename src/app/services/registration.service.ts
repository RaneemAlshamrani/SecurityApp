import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RegistrationService {

  employees: any[] = [];
  visitors: any[] = [];
  trainees: any[] = [];
  companions: any[] = [];

  private loaded = false;

  constructor(private http: HttpClient) {}

  loadInitialData() {
    if (this.loaded) return;
    this.http.get<any>('assets/data/mock-data.json').subscribe(data => {
      this.employees = data.employees;
      this.visitors = data.visitors;
      this.trainees = data.trainees;
      this.companions = data.companions;
      this.loaded = true;
    });
  }

  addEmployee(employee: any) {
    this.employees.push({ ...employee, time: new Date().toISOString() });
  }

  addVisitor(visitor: any) {
    this.visitors.push({ ...visitor, time: new Date().toISOString() });
  }

  addTrainee(trainee: any) {
    this.trainees.push({ ...trainee, time: new Date().toISOString() });
  }

  addCompanions(companions: any[]) {
    companions.forEach(c => this.companions.push({ ...c, time: new Date().toISOString() }));
  }

  getAllRegistrations() {
    return [
      ...this.employees.map(e => ({ ...e, type: 'موظف' })),
      ...this.visitors.map(v => ({ ...v, type: 'مراجع' })),
      ...this.trainees.map(t => ({ ...t, type: 'متدرب' })),
      ...this.companions.map(c => ({ ...c, type: 'مرافق' })),
    ];
  }
}