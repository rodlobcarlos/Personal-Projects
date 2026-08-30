import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;
  const STORAGE_KEY = 'live-tasks-lang';

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    service = TestBed.inject(I18nService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should set the html lang attribute', () => {
    expect(document.documentElement.lang).toBeTruthy();
    service.setLang('en');
    expect(document.documentElement.lang).toBe('en');
    service.setLang('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('should translate a known key in default language', () => {
    const value = service.t('common.back');
    expect(typeof value).toBe('string');
    expect(value.length).toBeGreaterThan(0);
  });

  it('should switch language and update translations', () => {
    service.setLang('es');
    const es = service.t('common.back');
    service.setLang('en');
    const en = service.t('common.back');
    expect(es).toBeTruthy();
    expect(en).toBeTruthy();
    expect(es).not.toBe(en);
  });

  it('should return the key when translation is missing', () => {
    expect(service.t('nonexistent.deep.key')).toBe('nonexistent.deep.key');
  });

  it('should persist language to localStorage', () => {
    service.setLang('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
  });
});
