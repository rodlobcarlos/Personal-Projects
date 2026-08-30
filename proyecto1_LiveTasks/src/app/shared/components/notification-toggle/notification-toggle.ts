import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-notification-toggle',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './notification-toggle.html',
  styleUrl: './notification-toggle.scss',
})
export class NotificationToggleComponent {
  private readonly notificationService = inject(NotificationService);

  readonly enabled = signal(this.notificationService.enabled);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  protected readonly configured = this.notificationService.isConfigured;

  async toggle(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(null);

    if (this.enabled()) {
      this.notificationService.disable().subscribe({
        next: () => {
          this.enabled.set(false);
          this.busy.set(false);
        },
        error: () => {
          this.error.set('notifications.error');
          this.busy.set(false);
        },
      });
      return;
    }

    const ok = await this.notificationService.requestPermission().toPromise();
    this.busy.set(false);
    if (ok) {
      this.enabled.set(true);
    } else {
      this.error.set('notifications.permissionDenied');
    }
  }
}
