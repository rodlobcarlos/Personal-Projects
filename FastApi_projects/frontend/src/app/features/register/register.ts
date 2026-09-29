import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', [Validators.required]],
  });

  constructor() {
    this.form.controls.confirm.addValidators((group) =>
      group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true },
    );
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const { email, fullName, password } = this.form.getRawValue();
    this.auth.register(email, fullName, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('¡Cuenta creada! Ya puedes entrar.');
        void this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(AuthService.message(err, 'No se ha podido crear la cuenta'));
      },
    });
  }
}
