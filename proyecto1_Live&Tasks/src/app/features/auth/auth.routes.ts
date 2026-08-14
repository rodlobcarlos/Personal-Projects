import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register').then((m) => m.RegisterComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
