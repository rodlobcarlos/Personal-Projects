import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../core/services/task.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent {
  private readonly taskService = inject(TaskService);

  readonly tasks = signal<Task[]>([]);
  readonly filter = signal<TaskStatus | 'all'>('all');
  readonly newTitle = signal('');
  readonly loading = signal(false);

  readonly filteredTasks = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.tasks();
    return this.tasks().filter((t) => t.status === f);
  });

  readonly pendingCount = computed(() =>
    this.tasks().filter((t) => t.status !== 'done').length,
  );

  readonly completedCount = computed(() =>
    this.tasks().filter((t) => t.status === 'done').length,
  );

  constructor() {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => this.tasks.set(res.tasks),
    });
  }

  addTask(): void {
    const title = this.newTitle().trim();
    if (!title || this.loading()) return;

    this.loading.set(true);
    this.taskService.createTask({ title }).subscribe({
      next: (res) => {
        this.tasks.update((list) => [res.task, ...list]);
        this.newTitle.set('');
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  cycleStatus(task: Task): void {
    const next: Record<TaskStatus, TaskStatus> = {
      todo: 'doing',
      doing: 'done',
      done: 'todo',
    };
    const newStatus = next[task.status];

    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (res) => {
        this.tasks.update((list) =>
          list.map((t) => (t.id === task.id ? res.task : t)),
        );
      },
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.tasks.update((list) => list.filter((t) => t.id !== id)),
    });
  }

  clearCompleted(): void {
    const done = this.tasks().filter((t) => t.status === 'done');
    for (const task of done) {
      this.deleteTask(task.id);
    }
  }

  setFilter(f: TaskStatus | 'all'): void {
    this.filter.set(f);
  }

  priorityClass(p: string): string {
    return `priority--${p}`;
  }
}
