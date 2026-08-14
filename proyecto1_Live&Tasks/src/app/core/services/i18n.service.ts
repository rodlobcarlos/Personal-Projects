import { Injectable, computed, signal } from '@angular/core';
import { en, type Translation } from '../../../i18n/en';
import { es } from '../../../i18n/es';

export type Lang = 'es' | 'en';

const STORAGE_KEY = 'live-tasks-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly dictionaries: Record<Lang, Translation> = { es, en };

  readonly lang = signal<Lang>(this.loadLang());

  readonly translations = computed<Translation>(() => this.dictionaries[this.lang()]);

  constructor() {
    this.applyLang(this.lang());
  }

  t(key: string): string {
    const value = key
      .split('.')
      .reduce<unknown>((obj, part) => (obj as Record<string, unknown> | null)?.[part], this.translations());
    return typeof value === 'string' ? value : key;
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.applyLang(lang);
  }

  private loadLang(): Lang {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
    return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  }

  private applyLang(lang: Lang): void {
    document.documentElement.lang = lang;
  }
}
