import { AfterViewInit, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../core/services/auth.service';
import { LangToggleComponent } from '../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LangToggleComponent,
    ThemeToggleComponent,
    TranslatePipe,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent implements AfterViewInit {
  protected readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly navRef = viewChild<ElementRef>('nav');

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
  }

  logout(): void {
    this.authService.logOut().subscribe();
  }
}
