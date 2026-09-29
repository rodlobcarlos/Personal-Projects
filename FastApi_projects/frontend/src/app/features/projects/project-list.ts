import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProjectsApi } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import {
  PROJECT_STATUS_LABELS,
  Page,
  Project,
  ProjectStatus,
} from '../../core/models';

type SortKey = 'updated_at' | 'due_date' | 'name' | 'progress';

@Component({
  selector: 'app-project-list',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {
  private readonly api = inject(ProjectsApi);
  private readonly toast = inject(ToastService);

  protected readonly statusLabels = PROJECT_STATUS_LABELS;
  protected readonly statusKeys = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly page = signal<Page<Project> | null>(null);
  protected readonly pendingDelete = signal<Project | null>(null);
  protected readonly deleting = signal(false);
  protected readonly view = signal<'grid' | 'table'>('grid');

  // Filtros
  protected readonly search = signal('');
  protected readonly status = signal<ProjectStatus | ''>('');
  protected readonly technology = signal('');
  protected readonly onlyMine = signal(false);
  protected readonly sortKey = signal<SortKey>('updated_at');
  protected readonly order = signal<'asc' | 'desc'>('desc');

  protected readonly projects = computed(() => this.page()?.items ?? []);
  protected readonly pagination = computed(() => this.page()?.pagination ?? null);
  protected readonly hasFilters = computed(
    () => !!this.search() || !!this.status() || !!this.technology() || this.onlyMine(),
  );

  private timer: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    this.load(1);
  }

  /** Aplica los filtros actuales contra la API. */
  protected load(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.api
      .listProjects({
        page,
        page_size: 12,
        search: this.search() || null,
        status: this.status() || null,
        technology: this.technology() || null,
        only_mine: this.onlyMine() ? true : undefined,
        order_by: this.sortKey(),
        order: this.order(),
      })
      .subscribe({
        next: (result) => {
          this.page.set(result);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(AuthService.message(err));
        },
      });
  }

  /** Debounce para no spamear la API con el buscador. */
  protected onSearchChange(value: string): void {
    this.search.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.load(1), 350);
  }

  protected onTechnologyChange(value: string): void {
    this.technology.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.load(1), 350);
  }

  protected toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.order.set(this.order() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.order.set('desc');
    }
    this.load(1);
  }

  protected clearFilters(): void {
    this.search.set('');
    this.status.set('');
    this.technology.set('');
    this.onlyMine.set(false);
    this.load(1);
  }

  protected goToPage(page: number): void {
    if (page >= 1) {
      this.load(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /** Primer clic pide confirmación, segundo clic confirma el borrado. */
  protected confirmDelete(project: Project): void {
    if (this.pendingDelete()?.id === project.id) {
      this.doDeleteConfirm();
      return;
    }
    this.pendingDelete.set(project);
    setTimeout(() => {
      if (this.pendingDelete()?.id === project.id) {
        this.pendingDelete.set(null);
      }
    }, 4000);
  }

  protected cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  protected doDeleteConfirm(): void {
    const project = this.pendingDelete();
    if (!project || this.deleting()) {
      return;
    }
    this.deleting.set(true);
    this.api.deleteProject(project.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.success(`Proyecto "${project.name}" eliminado`);
        this.load(this.pagination()?.page ?? 1);
      },
      error: (err) => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.error(AuthService.message(err, 'No se ha podido eliminar el proyecto'));
      },
    });
  }
}
