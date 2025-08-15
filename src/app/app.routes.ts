import { Routes } from '@angular/router';

export const routes: Routes = [
  // Main pages
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
  },

  // Authentication pages
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },

  // Ecommerce module
  {
    path: 'shop',
    loadChildren: () => import('./ecommerce/ecommerce.routes').then(m => m.ecommerceRoutes)
  },
  {
    path: 'projects',
    loadComponent: () => import('./project-management/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./invoices/invoices.component').then(m => m.InvoicesComponent)
  },

  // 404
  {
    path: 'not-found',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // Default redirect
  {
    path: '',
    redirectTo: '/shop',
    pathMatch: 'full'
  },

  // Wildcard route for 404
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
