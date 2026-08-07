import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register-employee',
    loadComponent: () =>
      import('./pages/register-employee/register-employee.page').then(
        (m) => m.RegisterEmployeePage
      ),
  },
  {
    path: 'register-visitor',
    loadComponent: () =>
      import('./pages/register-visitor/register-visitor.page').then(
        (m) => m.RegisterVisitorPage
      ),
  },
  {
    path: 'register-trainee',
    loadComponent: () =>
      import('./pages/register-trainee/register-trainee.page').then(
        (m) => m.RegisterTraineePage
      ),
  },
  {
    path: 'register-companion',
    loadComponent: () =>
      import('./pages/register-companion/register-companion.page').then(
        (m) => m.RegisterCompanionPage
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports.page').then((m) => m.ReportsPage),
  },
  {
    path: 'report-table',
    loadComponent: () =>
      import('./pages/report-table/report-table.page').then(
        (m) => m.ReportTablePage
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./pages/success/success.page').then((m) => m.SuccessPage),
  },
  
  {
  path: 'forgot-password',
  loadComponent: () =>
    import('./pages/forgot-password/forgot-password.page')
      .then(m => m.ForgotPasswordPage)
 },
{
  path: 'reset-password',
  loadComponent: () =>
    import('./pages/reset-password/reset-password.page')
      .then((m) => m.ResetPasswordPage),
},

{
    path: '**',
    redirectTo: 'login',
  },


];