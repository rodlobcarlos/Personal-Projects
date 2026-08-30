import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let loggingOut = false;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !loggingOut) {
        loggingOut = true;
        const current = authService.user();
        if (current) {
          authService.logOut().subscribe();
        }
      }
      return throwError(() => error);
    }),
  );
};
