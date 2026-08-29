import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component';

export const appShellRoutes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./tasks/tasks.component').then((m) => m.TasksComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./calendar/calendar.component').then((m) => m.CalendarComponent),
      },
      {
        path: 'monitor',
        loadComponent: () =>
          import('./monitor/monitor.component').then((m) => m.MonitorComponent),
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./notes/notes.component').then((m) => m.NotesComponent),
      },
    ],
  },
];
