import { AfterViewInit, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthService } from '../../core/services/auth.service';
import { LangToggleComponent } from '../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, LangToggleComponent, ThemeToggleComponent, TranslatePipe],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent implements AfterViewInit {
  protected readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly navRef = viewChild<ElementRef<HTMLElement>>('nav');

  ngAfterViewInit(): void {
    const nav = this.navRef()?.nativeElement;
    if (nav) {
      gsap.from(nav, {
        autoAlpha: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    if (!nav || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tabs = Array.from(nav.querySelectorAll<HTMLElement>('[data-scroll-target]'));

    const sections = tabs
      .map((tab) => document.getElementById(tab.dataset['scrollTarget'] ?? ''))
      .filter((el): el is HTMLElement => !!el);

    const activeClass = 'shell-tab--active';
    const triggers = sections
      .map((section, i) => {
        return ScrollTrigger.create({
          trigger: section,
          start: 'top 40%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (!self.isActive) return;
            tabs.forEach((t) => t.classList.remove(activeClass));
            const tab = tabs[i];
            if (tab) tab.classList.add(activeClass);
          },
        });
      })
      .filter((t): t is ScrollTrigger => !!t);

    this.destroyRef.onDestroy(() => {
      triggers.forEach((t) => t.kill());
    });
  }

  scrollTo(target: string): void {
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    this.authService.logOut().subscribe();
  }
}
