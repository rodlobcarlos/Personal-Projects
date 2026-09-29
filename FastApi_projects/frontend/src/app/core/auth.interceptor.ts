import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

/**
 * Añade el token JWT a cada petición y, ante un 401, intenta renovar la
 * sesión una única vez antes de cerrar la sesión.
 */
export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const token = auth.accessToken;

  const authedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authedRequest).pipe(
    catchError((error: unknown) => {
      const isAuthEndpoint = request.url.includes('/auth/login') || request.url.includes('/auth/refresh');
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthEndpoint) {
        return auth.refreshTokens().pipe(
          switchMap((tokens) =>
            next(request.clone({ setHeaders: { Authorization: `Bearer ${tokens.access_token}` } })),
          ),
          catchError(() => {
            auth.logout();
            return throwError(() => error);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
