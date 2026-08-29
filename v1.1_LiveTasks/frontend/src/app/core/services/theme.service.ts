import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

const THEME_KEY = 'livetasks_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('dark');

  constructor() {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      this.theme.set(saved);
    }

    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
      localStorage.setItem(THEME_KEY, this.theme());
    });
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }
}
