import {
  Component,
  ChangeDetectionStrategy,
  signal,
  HostListener,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface NavItem {
  labelKey: string;
  targetId: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <nav
      class="navbar"
      [class.scrolled]="scrolled()"
      role="navigation"
      [attr.aria-label]="'NAV.ARIA_LABEL' | translate"
    >
      <div class="navbar-inner">
        <a class="logo" href="#home" (click)="scrollTo('home', $event)">CRLdev</a>

        <ul class="nav-links" [class.menu-open]="menuOpen()">
          @for (item of navItems; track item.targetId) {
            <li>
              <a
                [class.active]="activeSection() === item.targetId"
                [href]="'#' + item.targetId"
                (click)="scrollTo(item.targetId, $event)"
              >
                {{ item.labelKey | translate }}
              </a>
            </li>
          }
        </ul>

        <div class="lang-switch" role="group" [attr.aria-label]="'NAV.CHANGE_LANG' | translate">
          @for (lang of languages; track lang) {
            <button
              class="lang-btn"
              [class.active]="currentLang() === lang"
              (click)="useLanguage(lang)"
            >
              {{ lang.toUpperCase() }}
            </button>
          }
        </div>

        <button
          class="hamburger"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="'NAV.TOGGLE_MENU' | translate"
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
    }

    .navbar {
      width: 100%;
      padding: 1rem 2rem;
      transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;
      background: transparent;
      border-bottom: 1px solid transparent;
    }

    .navbar.scrolled {
      background: rgba(9, 10, 15, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .navbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-size: 1.4rem;
      font-weight: 700;
      color: #4ae3ff;
      text-decoration: none;
      letter-spacing: 0.05em;
      transition: opacity 0.2s ease;
    }

    .logo:hover {
      opacity: 0.8;
    }

    .nav-links {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0.3rem 0;
      position: relative;
      transition: color 0.2s ease;
    }

    .nav-links a:hover {
      color: white;
    }

    .nav-links a.active {
      color: #4ae3ff;
    }

    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #4ae3ff;
      border-radius: 1px;
    }

    .nav-links a:focus-visible {
      outline: 2px solid #4ae3ff;
      outline-offset: 4px;
      border-radius: 4px;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      z-index: 1001;
    }

    .hamburger:focus-visible {
      outline: 2px solid #4ae3ff;
      outline-offset: 4px;
      border-radius: 4px;
    }

    .bar {
      display: block;
      width: 24px;
      height: 2px;
      background: white;
      border-radius: 1px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .hamburger[aria-expanded='true'] .bar:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .hamburger[aria-expanded='true'] .bar:nth-child(2) {
      opacity: 0;
    }

    .hamburger[aria-expanded='true'] .bar:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .lang-switch {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      padding: 0.2rem;
    }

    .lang-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      cursor: pointer;
      transition: color 0.2s ease, background 0.2s ease;
    }

    .lang-btn:hover {
      color: white;
    }

    .lang-btn.active {
      background: rgba(74, 227, 255, 0.2);
      color: #4ae3ff;
    }

    .lang-btn:focus-visible {
      outline: 2px solid #4ae3ff;
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0.8rem 1rem;
      }

      .hamburger {
        display: flex;
      }

      .nav-links {
        position: fixed;
        top: 0;
        right: 0;
        width: 70%;
        max-width: 280px;
        height: 100vh;
        flex-direction: column;
        gap: 0;
        padding: 5rem 2rem 2rem;
        background: rgba(9, 10, 15, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-left: 1px solid rgba(255, 255, 255, 0.08);
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }

      .nav-links.menu-open {
        transform: translateX(0);
      }

      .nav-links a {
        font-size: 1.1rem;
        padding: 0.8rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .nav-links a.active::after {
        bottom: -1px;
        height: 1px;
      }
    }
  `,
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly navItems: NavItem[] = [
    { labelKey: 'NAV.HOME', targetId: 'home' },
    { labelKey: 'NAV.ABOUT', targetId: 'about' },
    { labelKey: 'NAV.TRAJECTORY', targetId: 'trajectory' },
    { labelKey: 'NAV.PROJECTS', targetId: 'projects' },
  ];

  readonly languages = ['es', 'en'];

  private translate = inject(TranslateService);

  scrolled = signal(false);
  activeSection = signal('home');
  menuOpen = signal(false);
  currentLang = signal(this.translate.currentLang() ?? 'es');

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.setupObserver();
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.observeSections());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }

  scrollTo(targetId: string, event: Event): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.activeSection.set(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  useLanguage(lang: string): void {
    if (lang === this.translate.currentLang()) {
      return;
    }
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((best, entry) =>
            entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best,
          );
          this.activeSection.set(top.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );
  }

  private observeSections(): void {
    let found = 0;
    this.navItems.forEach((item) => {
      const el = document.getElementById(item.targetId);
      if (el) {
        this.observer!.observe(el);
        found++;
      }
    });
    if (found < this.navItems.length) {
      setTimeout(() => this.observeSections(), 100);
    }
  }
}
