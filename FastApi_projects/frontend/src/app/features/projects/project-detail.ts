import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProjectsApi } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import {
  Page,
  PROJECT_STATUS_LABELS,
  Project,
  ProjectStats,
  ProjectStatus,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  Task,
  TaskPriority,
  TaskStatus,
} from '../../core/models';

@Component({
  selector: 'app-project-detail',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {
  private readonly api = inject(ProjectsApi);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly projectLabels = PROJECT_STATUS_LABELS;
  protected readonly taskStatusLabels = TASK_STATUS_LABELS;
  protected readonly taskPriorityLabels = TASK_PRIORITY_LABELS;
  protected readonly statusKeys = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];
  protected readonly taskStatusKeys = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];
  protected readonly priorityKeys = Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[];

  protected readonly id = signal<number | null>(null);
  protected readonly project = signal<Project | null>(null);
  protected readonly stats = signal<ProjectStats | null>(null);
  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal(true);
  protected readonly tasksLoading = signal(false);
  protected readonly error = signal('');

  // Filtros de tareas
  protected readonly taskFilter = signal<TaskStatus | 'all'>('all');
  protected readonly priorityFilter = signal<TaskPriority | ''>('');
  protected readonly overdueOnly = signal(false);

  // Modal de tarea
  protected readonly taskModal = signal(false);
  protected readonly editingTask = signal<Task | null>(null);
  protected readonly savingTask = signal(false);
  protected readonly taskError = signal('');
  protected readonly pendingTaskDelete = signal<Task | null>(null);
  protected readonly togglingTask = signal<number | null>(null);

  protected readonly taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    description: [''],
    status: ['todo' as TaskStatus, [Validators.required]],
    priority: ['medium' as TaskPriority, [Validators.required]],
    estimated_hours: [null as number | null],
    due_date: [''],
  });

  protected readonly visibleTasks = computed(() => {
    const status = this.taskFilter();
    const priority = this.priorityFilter();
    const overdue = this.overdueOnly();

    return this.tasks().filter((task) => {
      if (status !== 'all' && task.status !== status) {
        return false;
      }
      if (priority && task.priority !== priority) {
        return false;
      }
      if (overdue && !task.is_overdue) {
        return false;
      }
      return true;
    });
  });

  protected readonly groupedTasks = computed(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
      blocked: [],
    };
    for (const task of this.visibleTasks()) {
      groups[task.status].push(task);
    }
    return groups;
  });

  protected readonly hasTaskFilters = computed(
    () => this.taskFilter() !== 'all' || !!this.priorityFilter() || this.overdueOnly(),
  );

  private projectIdValue = 0;

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    this.projectIdValue = Number(raw);
    if (!this.projectIdValue || Number.isNaN(this.projectIdValue)) {
      this.error.set('Proyecto no válido');
      this.loading.set(false);
      return;
    }
    this.id.set(this.projectIdValue);
    this.loadProject();
    this.loadTasks();
  }

  protected loadProject(): void {
    this.api.getProject(this.projectIdValue).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false);
        this.api.getStats(this.projectIdValue).subscribe({
          next: (stats) => this.stats.set(stats),
          error: () => this.stats.set(null),
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(AuthService.message(err, 'No se ha podido cargar el proyecto'));
      },
    });
  }

  protected loadTasks(): void {
    this.tasksLoading.set(true);
    this.api
      .listTasks(this.projectIdValue, { page_size: 100, order_by: 'created_at', order: 'asc' })
      .subscribe({
        next: (page: Page<Task>) => {
          this.tasks.set(page.items);
          this.tasksLoading.set(false);
        },
        error: (err) => {
          this.tasksLoading.set(false);
          this.toast.error(AuthService.message(err, 'No se han podido cargar las tareas'));
        },
      });
  }

  // --- Cambio de estado del proyecto ---------------------------------------

  protected changeStatus(status: ProjectStatus): void {
    const project = this.project();
    if (!project || project.status === status) {
      return;
    }
    this.api.updateProject(project.id, { status }).subscribe({
      next: (updated) => {
        this.project.set(updated);
        this.toast.success(`Estado actualizado a ${PROJECT_STATUS_LABELS[status]}`);
      },
      error: (err) => this.toast.error(AuthService.message(err)),
    });
  }

  // --- Tareas ----------------------------------------------------------------

  protected openTaskModal(task: Task | null): void {
    this.taskError.set('');
    this.editingTask.set(task);
    this.taskForm.reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'todo',
      priority: task?.priority ?? 'medium',
      estimated_hours: task?.estimated_hours ?? null,
      due_date: task?.due_date ?? '',
    });
    this.taskModal.set(true);
  }

  protected closeTaskModal(): void {
    this.taskModal.set(false);
    this.editingTask.set(null);
    this.taskError.set('');
  }

  protected saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.savingTask.set(true);
    this.taskError.set('');

    const raw = this.taskForm.getRawValue();
    const payload = {
      title: raw.title.trim(),
      description: raw.description.trim() || null,
      status: raw.status,
      priority: raw.priority,
      estimated_hours: raw.estimated_hours === null ? null : Math.round(Number(raw.estimated_hours)),
      due_date: raw.due_date || null,
    };

    const editing = this.editingTask();
    const request = editing
      ? this.api.updateTask(editing.id, payload)
      : this.api.createTask(this.projectIdValue, payload);

    request.subscribe({
      next: () => {
        this.savingTask.set(false);
        this.closeTaskModal();
        this.toast.success(editing ? 'Tarea actualizada' : 'Tarea creada');
        this.loadTasks();
        this.loadProject();
      },
      error: (err) => {
        this.savingTask.set(false);
        this.taskError.set(AuthService.message(err));
      },
    });
  }

  /** Marca/desmarca una tarea como completada; el progreso se recalcula en la API. */
  protected toggleComplete(task: Task): void {
    if (this.togglingTask() === task.id) {
      return;
    }
    this.togglingTask.set(task.id);
    this.api
      .updateTask(task.id, { is_completed: !task.is_completed, status: !task.is_completed ? 'done' : 'todo' })
      .subscribe({
        next: () => {
          this.togglingTask.set(null);
          this.loadTasks();
          this.loadProject();
        },
        error: (err) => {
          this.togglingTask.set(null);
          this.toast.error(AuthService.message(err));
        },
      });
  }

  protected askDeleteTask(task: Task): void {
    if (this.pendingTaskDelete()?.id === task.id) {
      this.deleteTask();
      return;
    }
    this.pendingTaskDelete.set(task);
    setTimeout(() => {
      if (this.pendingTaskDelete()?.id === task.id) {
        this.pendingTaskDelete.set(null);
      }
    }, 4000);
  }

  protected deleteTask(): void {
    const task = this.pendingTaskDelete();
    if (!task) {
      return;
    }
    this.api.deleteTask(task.id).subscribe({
      next: () => {
        this.pendingTaskDelete.set(null);
        this.toast.success('Tarea eliminada');
        this.loadTasks();
        this.loadProject();
      },
      error: (err) => {
        this.pendingTaskDelete.set(null);
        this.toast.error(AuthService.message(err));
      },
    });
  }

  protected clearTaskFilters(): void {
    this.taskFilter.set('all');
    this.priorityFilter.set('');
    this.overdueOnly.set(false);
  }

  protected deleteProject(): void {
    const project = this.project();
    if (!project) {
      return;
    }
    this.api.deleteProject(project.id).subscribe({
      next: () => {
        this.toast.success(`Proyecto "${project.name}" eliminado`);
        void this.router.navigate(['/projects']);
      },
      error: (err) => this.toast.error(AuthService.message(err)),
    });
  }
}
