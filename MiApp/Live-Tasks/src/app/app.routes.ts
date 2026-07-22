import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./components/pricing/pricing').then((m) => m.PricingComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];