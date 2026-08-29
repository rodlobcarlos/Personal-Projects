import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-primary flex flex-col items-center justify-center gap-6">
      <h1 class="text-4xl font-bold text-primary">LiveTasks — placeholder</h1>
      <p class="text-secondary">La landing page se implementará en una fase posterior.</p>
      <a routerLink="/login" class="px-6 py-3 bg-accent text-white rounded-lg font-semibold">
        Empezar
      </a>
      <router-outlet />
    </div>
  `,
})
export class LandingComponent {}
