import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly loading = signal(false);
  readonly errorKey = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.errorKey.set(null);
    this.authService.signIn(email, password).subscribe({
      next: () => this.router.navigate(['/app/tasks']),
      error: (error: unknown) => {
        const key = this.authService.errorKey(error);
        if (key) this.errorKey.set(key);
      },
      complete: () => this.loading.set(false),
    });
  }

  signInWithGoogle(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.errorKey.set(null);
    this.authService.signInWithGoogle().subscribe({
      next: () => this.router.navigate(['/app/tasks']),
      error: (error: unknown) => {
        const key = this.authService.errorKey(error);
        if (key) this.errorKey.set(key);
      },
      complete: () => this.loading.set(false),
    });
  }

  hasError(field: string, validator: string): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.hasError(validator);
  }
}
