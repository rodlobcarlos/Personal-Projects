import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { TokenResponse, User } from './models';

const ACCESS_KEY = 'projects.access_token';
const REFRESH_KEY = 'projects.refresh_token';
const USER_KEY = 'projects.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _user = signal<User | null>(this.readUser());
  private readonly _accessToken = signal<string | null>(localStorage.getItem(ACCESS_KEY));
  private refreshInFlight$: Observable<TokenResponse> | null = null;

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');
  readonly displayName = computed(() => this._user()?.full_name ?? 'Invitado');
  readonly initials = computed(() =>
    (this._user()?.full_name ?? '?')
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );

  get accessToken(): string | null {
    return this._accessToken();
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  login(email: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  register(email: string, fullName: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, {
      email,
      full_name: fullName,
      password,
    });
  }

  logout(redirect = true): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this._accessToken.set(null);
    this._user.set(null);
    if (redirect) {
      void this.router.navigate(['/login']);
    }
  }

  /**
   * Renueva el access token usando el refresh token. Si ya hay un refresco en
   * curso se comparte la misma petición, de modo que varios 401 simultáneos no
   * disparan refrescos en paralelo ni compiten entre sí.
   */
  refreshTokens(): Observable<TokenResponse> {
    if (!this.refreshInFlight$) {
      const token = this.refreshToken;
      if (!token) {
        return throwError(() => new Error('No hay refresh token'));
      }
      this.refreshInFlight$ = this.http
        .post<TokenResponse>(`${environment.apiUrl}/auth/refresh`, { refresh_token: token })
        .pipe(
          tap((tokens) => this.storeTokens(tokens)),
          catchError((error) => {
            this.logout();
            return throwError(() => error);
          }),
          finalize(() => (this.refreshInFlight$ = null)),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }
    return this.refreshInFlight$;
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => {
        this._user.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }),
    );
  }

  /** Extrae un mensaje legible de cualquier error de la API. */
  static message(error: unknown, fallback = 'Ha ocurrido un error inesperado'): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as
        | { detail?: string; error?: { message?: string; context?: { errors?: { message: string }[] } } }
        | null;

      if (body?.error?.context?.errors?.length) {
        return body.error.context.errors
          .map((item) => item.message)
          .join(' · ')
          .replace(/Value error, /g, '');
      }
      if (body?.error?.message) {
        return body.error.message;
      }
      if (body?.detail) {
        return typeof body.detail === 'string' ? body.detail : fallback;
      }
      if (error.status === 0) {
        return 'No se pudo conectar con el servidor de la API';
      }
      if (error.status === 401) {
        return 'Sesión caducada o credenciales incorrectas';
      }
    }
    return fallback;
  }

  private storeTokens(tokens: TokenResponse): void {
    localStorage.setItem(ACCESS_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
    this._accessToken.set(tokens.access_token);
    if (!this._user()) {
      this.loadCurrentUser().subscribe({ error: () => undefined });
    }
  }

  private readUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
