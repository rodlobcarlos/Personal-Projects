import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const STORAGE_KEY = 'live-tasks-theme';

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should default to light theme', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('should apply the theme attribute to <html>', () => {
    const service = TestBed.inject(ThemeService);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    service.setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should toggle between light and dark', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should persist theme to localStorage', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  it('should restore saved theme on init', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('should ignore an invalid stored value', () => {
    localStorage.setItem(STORAGE_KEY, 'neon');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });
});
