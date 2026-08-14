import { Component, computed, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TaskItem } from './components/task-item/task-item';
import { TaskFilter, TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [TaskItem],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('listItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-14px) scale(0.96)' }),
        animate('280ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [animate('220ms ease-in', style({ opacity: 0, transform: 'translateX(40px) scale(0.9)' }))]),
    ]),
  ],
})
export class App {
  protected readonly newTitle = signal('');
  protected readonly filter = signal<TaskFilter>('all');
  protected readonly darkMode = signal(this.loadTheme());

  protected get tasks() {
    return this.service.tasks;
  }

  protected readonly filteredTasks = computed(() => {
    const filter = this.filter();
    const tasks = this.service.tasks();
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  });

  protected readonly remaining = computed(() => this.service.tasks().filter((t) => !t.completed).length);
  protected readonly completedCount = computed(() => this.service.tasks().filter((t) => t.completed).length);
  protected readonly progress = computed(() => {
    const total = this.service.tasks().length;
    return total === 0 ? 0 : Math.round((this.completedCount() / total) * 100);
  });
  protected readonly isAll = computed(() => this.filter() === 'all');
  protected readonly isActive = computed(() => this.filter() === 'active');
  protected readonly isCompleted = computed(() => this.filter() === 'completed');

  constructor(private readonly service: TaskService) {}

  protected onInput(event: Event): void {
    this.newTitle.set((event.target as HTMLInputElement).value);
  }

  protected onAdd(): void {
    this.service.addTask(this.newTitle());
    this.newTitle.set('');
  }

  protected setFilter(filter: TaskFilter): void {
    this.filter.set(filter);
  }

  protected clearCompleted(): void {
    this.service.clearCompleted();
  }

  protected toggleTheme(): void {
    this.darkMode.update((value) => {
      const next = !value;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('gestor-tareas-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  private loadTheme(): boolean {
    const saved = localStorage.getItem('gestor-tareas-theme');
    const dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    return dark;
  }
}
