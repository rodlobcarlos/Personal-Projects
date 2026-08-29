import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-primary flex">
      <aside class="w-64 bg-secondary border-r border-theme p-6 flex flex-col">
        <h1 class="text-xl font-bold text-primary mb-8">LiveTasks</h1>
        <nav class="flex flex-col gap-2 flex-1">
          <a routerLink="/app/tasks" routerLinkActive="bg-accent text-white"
             class="px-4 py-2 rounded-lg text-secondary hover:bg-tertiary/50 transition-colors">Tareas</a>
          <a routerLink="/app/calendar" routerLinkActive="bg-accent text-white"
             class="px-4 py-2 rounded-lg text-secondary hover:bg-tertiary/50 transition-colors">Calendario</a>
          <a routerLink="/app/monitor" routerLinkActive="bg-accent text-white"
             class="px-4 py-2 rounded-lg text-secondary hover:bg-tertiary/50 transition-colors">Monitoreo</a>
          <a routerLink="/app/notes" routerLinkActive="bg-accent text-white"
             class="px-4 py-2 rounded-lg text-secondary hover:bg-tertiary/50 transition-colors">Notas</a>
        </nav>
        <button (click)="authService.logout()"
                class="mt-4 px-4 py-2 bg-tertiary rounded-lg text-secondary hover:text-primary transition-colors">
          Cerrar sesión
        </button>
      </aside>
      <main class="flex-1 p-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppShellComponent {
  protected authService = inject(AuthService);
}
