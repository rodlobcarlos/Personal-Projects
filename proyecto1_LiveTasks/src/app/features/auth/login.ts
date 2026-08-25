import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly cardRef = viewChild<ElementRef>('card');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

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
