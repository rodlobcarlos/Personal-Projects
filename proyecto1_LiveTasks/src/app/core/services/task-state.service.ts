import { Injectable, inject, signal } from '@angular/core';
import { TaskService } from './task.service';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskStateService {
  private readonly taskService = inject(TaskService);

  readonly tasks = signal<Task[]>([]);

  loadTasks(): Promise<void> {
    return new Promise((resolve) => {
      this.taskService.getTasks().subscribe({
        next: (res) => {
          this.tasks.set(res.tasks);
          resolve();
        },
        error: () => resolve(),
      });
    });
  }

  createTask(payload: CreateTaskPayload): Promise<Task | null> {
    return new Promise((resolve) => {
      this.taskService.createTask(payload).subscribe({
        next: (res) => {
          this.tasks.update((list) => [res.task, ...list]);
          resolve(res.task);
        },
        error: () => resolve(null),
      });
    });
  }

  updateTask(id: number, payload: UpdateTaskPayload): Promise<Task | null> {
    return new Promise((resolve) => {
      this.taskService.updateTask(id, payload).subscribe({
        next: (res) => {
          this.tasks.update((list) =>
            list.map((t) => (t.id === id ? res.task : t)),
          );
          resolve(res.task);
        },
        error: () => resolve(null),
      });
    });
  }

  deleteTask(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks.update((list) => list.filter((t) => t.id !== id));
          resolve(true);
        },
        error: () => resolve(false),
      });
    });
  }
}
