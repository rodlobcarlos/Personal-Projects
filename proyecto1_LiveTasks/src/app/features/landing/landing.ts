import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate';
import { LangToggleComponent } from '../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface Feature {
  key: 'tasks' | 'calendar' | 'monitoring' | 'notes';
  desc: 'tasksDesc' | 'calendarDesc' | 'monitoringDesc' | 'notesDesc';
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, ScrollAnimateDirective, LangToggleComponent, ThemeToggleComponent, TranslatePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly features: Feature[] = [
    { key: 'tasks', desc: 'tasksDesc' },
    { key: 'calendar', desc: 'calendarDesc' },
    { key: 'monitoring', desc: 'monitoringDesc' },
    { key: 'notes', desc: 'notesDesc' },
  ];

  readonly googleLoading = signal(false);
  readonly googleError = signal<string | null>(null);

  readonly currentYear = new Date().getFullYear();

  signInWithGoogle(): void {
    if (this.googleLoading()) return;
    this.googleLoading.set(true);
    this.googleError.set(null);
    this.authService.signInWithGoogle().subscribe({
      next: () => this.router.navigate(['/app/tasks']),
      error: (error: unknown) => {
        const key = this.authService.errorKey(error);
        if (key) this.googleError.set(key);
      },
      complete: () => this.googleLoading.set(false),
    });
  }
}
