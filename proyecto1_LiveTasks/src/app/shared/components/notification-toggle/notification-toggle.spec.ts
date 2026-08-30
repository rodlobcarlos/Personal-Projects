import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationToggleComponent } from './notification-toggle';
import { NotificationService } from '../../../core/services/notification.service';

describe('NotificationToggleComponent', () => {
  let serviceSpy: {
    enabled: boolean;
    isConfigured: boolean;
    requestPermission: ReturnType<typeof vi.fn>;
    disable: ReturnType<typeof vi.fn>;
  };

  function setup(opts: {
    configured: boolean;
    enabled: boolean;
    requestResult: boolean;
  }): ComponentFixture<NotificationToggleComponent> {
    serviceSpy = {
      enabled: opts.enabled,
      isConfigured: opts.configured,
      requestPermission: vi.fn(() => of(opts.requestResult)),
      disable: vi.fn(() => of(undefined)),
    };
    TestBed.configureTestingModule({
      imports: [NotificationToggleComponent],
      providers: [{ provide: NotificationService, useValue: serviceSpy }],
    });
    const fixture = TestBed.createComponent(NotificationToggleComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('no renderiza el botón cuando no está configurado', () => {
    const fixture = setup({ configured: false, enabled: false, requestResult: true });
    const btn = fixture.nativeElement.querySelector('.notification-toggle');
    expect(btn).toBeNull();
  });

  it('habilita las notificaciones cuando el permiso se concede', async () => {
    const fixture = setup({ configured: true, enabled: false, requestResult: true });
    const comp = fixture.componentInstance;
    await comp.toggle();
    expect(serviceSpy.requestPermission).toHaveBeenCalled();
    expect(comp.enabled()).toBe(true);
  });

  it('no habilita si el permiso se deniega', async () => {
    const fixture = setup({ configured: true, enabled: false, requestResult: false });
    const comp = fixture.componentInstance;
    await comp.toggle();
    expect(comp.enabled()).toBe(false);
    expect(comp.error()).toBe('notifications.permissionDenied');
  });

  it('desactiva las notificaciones', async () => {
    const fixture = setup({ configured: true, enabled: true, requestResult: true });
    const comp = fixture.componentInstance;
    await comp.toggle();
    expect(serviceSpy.disable).toHaveBeenCalled();
    expect(comp.enabled()).toBe(false);
  });
});
