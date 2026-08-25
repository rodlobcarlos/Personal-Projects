import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

function matchPassword(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly cardRef = viewChild<ElementRef>('card');

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [matchPassword] },
  );

  readonly loading = signal(false);
  readonly errorKey = signal<string | null>(null);

  ngAfterViewInit(): void {
    const card = this.cardRef()?.nativeElement;
    if (card) {
      gsap.from(card, {
        autoAlpha: 0,
        y: 30,
        scale: 0.95,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    const { name, email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.errorKey.set(null);
    this.authService.signUp(name, email, password).subscribe({
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

  hasMismatch(): boolean {
    return this.form.touched && !!this.form.hasError('passwordMismatch');
  }
}
