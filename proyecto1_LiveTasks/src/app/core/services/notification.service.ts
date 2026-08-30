import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { Observable, from, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

const ENABLED_KEY = 'pushEnabled';
const TOKEN_KEY = 'pushToken';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/push`;

  private readonly vapidKey = environment.firebase.vapidKey;

  get isConfigured(): boolean {
    return !this.vapidKey.startsWith('PENDIENTE');
  }

  get enabled(): boolean {
    return this.isConfigured && localStorage.getItem(ENABLED_KEY) === 'true';
  }

  get storedToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  requestPermission(): Observable<boolean> {
    return from(this.subscribe());
  }

  disable(): Observable<void> {
    const token = this.storedToken;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ENABLED_KEY);

    if (token && this.isConfigured) {
      return this.http.delete<void>(`${this.url}/token`, { params: { token } });
    }
    return new Observable<void>((sub) => {
      sub.next();
      sub.complete();
    });
  }

  syncOfflineToken(): void {
    const token = this.storedToken;
    if (token && this.isConfigured) {
      this.http.post<void>(`${this.url}/token`, { token }).subscribe({ error: () => undefined });
    }
  }

  onForegroundMessage(listener: (payload: MessagePayload) => void): void {
    if (!this.isConfigured || typeof Notification === 'undefined') return;
    try {
      onMessage(this.messaging(), listener);
    } catch {
      /* notificación no disponible */
    }
  }

  private async subscribe(): Promise<boolean> {
    if (!this.isConfigured || typeof Notification === 'undefined') return false;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return false;

      const token = await getToken(this.messaging(), { vapidKey: this.vapidKey });
      if (!token) return false;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ENABLED_KEY, 'true');
      await firstValueFrom(this.http.post<void>(`${this.url}/token`, { token }));
      return true;
    } catch {
      return false;
    }
  }

  private messaging() {
    return getMessaging(getApp());
  }
}
