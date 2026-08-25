import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
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
export class LandingComponent implements AfterViewInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly heroRef = viewChild<ElementRef>('hero');
  private readonly headerRef = viewChild<ElementRef>('header');

  readonly features: Feature[] = [
    { key: 'tasks', desc: 'tasksDesc' },
    { key: 'calendar', desc: 'calendarDesc' },
    { key: 'monitoring', desc: 'monitoringDesc' },
    { key: 'notes', desc: 'notesDesc' },
  ];

  readonly googleLoading = signal(false);
  readonly googleError = signal<string | null>(null);

  readonly currentYear = new Date().getFullYear();

  ngAfterViewInit(): void {
    const header = this.headerRef()?.nativeElement;
    const hero = this.heroRef()?.nativeElement;

    if (header) {
      gsap.from(header, {
        autoAlpha: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    if (hero) {
      const children = hero.children;
      gsap.from(children, {
        autoAlpha: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.2,
      });
    }
  }

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
