import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification.service';

describe('NotificationService (sin VAPID key configurada)', () => {
  let service: NotificationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(NotificationService);
  });

  it('está configurado porque la vapidKey es real', () => {
    expect(service.isConfigured).toBe(true);
  });

  it('no está habilitado cuando no hay permiso guardado', () => {
    expect(service.enabled).toBe(false);
  });

  it('requestPermission devuelve false cuando Notification no está disponible', async () => {
    const ok = await firstValueFrom(service.requestPermission());
    expect(ok).toBe(false);
  });

  it('disable elimina el estado y completa sin token', async () => {
    localStorage.setItem('pushEnabled', 'true');
    await firstValueFrom(service.disable());
    expect(localStorage.getItem('pushEnabled')).toBeNull();
  });

  it('syncOfflineToken no lanza error sin token', () => {
    expect(() => service.syncOfflineToken()).not.toThrow();
  });

  it('onForegroundMessage no lanza error y no invoca el listener sin Notification', () => {
    const spy = vi.fn();
    expect(() => service.onForegroundMessage(spy)).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
  });
});
