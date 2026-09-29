import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    title: 'Entrar · Projects API',
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/register/register').then((m) => m.Register),
    title: 'Crear cuenta · Projects API',
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard · Projects API',
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/projects/project-list').then((m) => m.ProjectList),
    title: 'Proyectos · Projects API',
  },
  {
    path: 'projects/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/projects/project-form').then((m) => m.ProjectForm),
    title: 'Nuevo proyecto · Projects API',
  },
  {
    path: 'projects/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/projects/project-detail').then((m) => m.ProjectDetail),
    title: 'Detalle · Projects API',
  },
  {
    path: 'projects/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/projects/project-form').then((m) => m.ProjectForm),
    title: 'Editar proyecto · Projects API',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
    title: 'Perfil · Projects API',
  },

  { path: '**', redirectTo: 'dashboard' },
];
