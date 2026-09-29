import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProjectsApi } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { PROJECT_STATUS_LABELS, ProjectStatus } from '../../core/models';

/** Valida que el repositorio sea una URL http(s) si se rellena. */
function optionalUrl(control: { value: unknown }): Record<string, boolean> | null {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return null;
  }
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? null : { url: true };
  } catch {
    return { url: true };
  }
}

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css',
})
export class ProjectForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProjectsApi);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly statusLabels = PROJECT_STATUS_LABELS;
  protected readonly statusKeys = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

  protected readonly id = signal<number | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  protected readonly isEdit = computed(() => this.id() !== null);
  protected readonly techInput = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    description: [''],
    technologies: [[] as string[]],
    repository_url: ['', [optionalUrl]],
    status: ['planned' as ProjectStatus, [Validators.required]],
    start_date: [''],
    due_date: [''],
  });

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    if (!raw) {
      return;
    }
    const id = Number(raw);
    this.id.set(id);
    this.loading.set(true);

    this.api.getProject(id).subscribe({
      next: (project) => {
        this.form.patchValue({
          name: project.name,
          description: project.description ?? '',
          technologies: project.technologies,
          repository_url: project.repository_url ?? '',
          status: project.status,
          start_date: project.start_date ?? '',
          due_date: project.due_date ?? '',
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(AuthService.message(err, 'No se ha podido cargar el proyecto'));
      },
    });
  }

  protected addTechnology(): void {
    const value = this.techInput().trim();
    if (!value) {
      return;
    }
    const current = this.form.controls.technologies.value;
    if (current.some((tech) => tech.toLowerCase() === value.toLowerCase())) {
      this.toast.info(`"${value}" ya está en la lista`);
      return;
    }
    this.form.controls.technologies.setValue([...current, value]);
    this.techInput.set('');
  }

  protected removeTechnology(tech: string): void {
    this.form.controls.technologies.setValue(
      this.form.controls.technologies.value.filter((item) => item !== tech),
    );
  }

  protected onTechKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTechnology();
    }
  }

  protected datesInvalid(): boolean {
    const start = this.form.controls.start_date.value;
    const due = this.form.controls.due_date.value;
    return !!(start && due && new Date(due) < new Date(start));
  }

  protected submit(): void {
    if (this.form.invalid || this.datesInvalid()) {
      this.form.markAllAsTouched();
      if (this.datesInvalid()) {
        this.error.set('La fecha de entrega no puede ser anterior a la fecha de inicio');
      }
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name.trim(),
      description: raw.description.trim() || null,
      technologies: raw.technologies,
      repository_url: raw.repository_url.trim() || null,
      status: raw.status,
      start_date: raw.start_date || null,
      due_date: raw.due_date || null,
    };

    const id = this.id();
    const request = id
      ? this.api.updateProject(id, payload)
      : this.api.createProject(payload);

    request.subscribe({
      next: (project) => {
        this.saving.set(false);
        this.toast.success(
          id ? `Proyecto "${project.name}" actualizado` : `Proyecto "${project.name}" creado`,
        );
        void this.router.navigate(['/projects', project.id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(AuthService.message(err));
      },
    });
  }
}
