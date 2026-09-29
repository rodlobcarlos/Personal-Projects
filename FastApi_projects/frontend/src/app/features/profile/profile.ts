import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProjectsApi } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProjectsApi);
  private readonly toast = inject(ToastService);
  protected readonly auth = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly profile = signal<User | null>(null);
  protected readonly users = signal<User[]>([]);
  protected readonly usersSearch = signal('');
  protected readonly pendingUser = signal<User | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
  });

  ngOnInit(): void {
    this.api.getProfile().subscribe({
      next: (user) => {
        this.profile.set(user);
        this.form.patchValue({ full_name: user.full_name, email: user.email });
        this.loading.set(false);
        if (user.role === 'admin') {
          this.loadUsers();
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(AuthService.message(err, 'No se ha podido cargar el perfil'));
      },
    });
  }

  protected loadUsers(): void {
    this.api.listUsers(this.usersSearch()).subscribe({
      next: (page) => this.users.set(page.items),
      error: () => this.users.set([]),
    });
  }

  protected onSearch(value: string): void {
    this.usersSearch.set(value);
    this.loadUsers();
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set('');

    const { full_name, email, password } = this.form.getRawValue();
    this.api
      .updateProfile({
        full_name: full_name.trim(),
        email: email.trim(),
        ...(password ? { password } : {}),
      })
      .subscribe({
        next: (user) => {
          this.saving.set(false);
          this.profile.set(user);
          this.auth.loadCurrentUser().subscribe({ error: () => undefined });
          this.form.controls.password.setValue('');
          this.toast.success('Perfil actualizado');
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(AuthService.message(err));
        },
      });
  }

  protected askToggleUser(user: User): void {
    this.pendingUser.set(user);
    setTimeout(() => {
      if (this.pendingUser()?.id === user.id) {
        this.pendingUser.set(null);
      }
    }, 4000);
  }

  protected toggleUserActive(user: User): void {
    this.api.setUserActive(user.id, !user.is_active).subscribe({
      next: (updated) => {
        this.pendingUser.set(null);
        this.toast.success(
          updated.is_active ? `${updated.full_name} reactivado` : `${updated.full_name} desactivado`,
        );
        this.loadUsers();
      },
      error: (err) => {
        this.pendingUser.set(null);
        this.toast.error(AuthService.message(err));
      },
    });
  }
}
