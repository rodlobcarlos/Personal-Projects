import { Injectable, effect, signal } from '@angular/core';
import { Task } from '../models/task';

export type TaskFilter = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'gestor-tareas';

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>([]);

  constructor() {
    this.load();
    effect(() => this.save(this.tasks()));
  }

  addTask(title: string): void {
    const clean = title.trim();
    if (!clean) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: clean,
      completed: false,
      createdAt: Date.now(),
    };
    this.tasks.update((t) => [...t, task]);
  }

  toggleTask(id: string): void {
    this.tasks.update((t) => t.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  editTask(id: string, title: string): void {
    const clean = title.trim();
    if (!clean) return;
    this.tasks.update((t) => t.map((task) => (task.id === id ? { ...task, title: clean } : task)));
  }

  deleteTask(id: string): void {
    this.tasks.update((t) => t.filter((task) => task.id !== id));
  }

  clearCompleted(): void {
    this.tasks.update((t) => t.filter((task) => !task.completed));
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.tasks.set(JSON.parse(raw) as Task[]);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private save(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}
