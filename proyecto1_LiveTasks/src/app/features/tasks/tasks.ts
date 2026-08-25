import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../core/services/task.service';
import { AiService } from '../../core/services/ai.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent implements AfterViewInit {
  private readonly taskService = inject(TaskService);
  private readonly aiService = inject(AiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly listRef = viewChild<ElementRef>('taskList');

  readonly tasks = signal<Task[]>([]);
  readonly filter = signal<TaskStatus | 'all'>('all');
  readonly newTitle = signal('');
  readonly loading = signal(false);
  readonly aiMode = signal(false);
  readonly aiParsing = signal(false);

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

  ngAfterViewInit(): void {
    const title = document.querySelector('.tasks-title');
    if (title) {
      gsap.from(title, {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks.set(res.tasks);
        this.animateList();
      },
    });
  }

  private animateList(): void {
    const list = this.listRef()?.nativeElement;
    if (list) {
      const items = list.querySelectorAll('.task-item');
      gsap.from(items, {
        autoAlpha: 0,
        y: 15,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }

  addTask(): void {
    const title = this.newTitle().trim();
    if (!title || this.loading()) return;

    if (this.aiMode()) {
      this.addTaskWithAI(title);
    } else {
      this.addTaskDirect(title);
    }
  }

  private addTaskDirect(title: string): void {
    this.loading.set(true);
    this.taskService.createTask({ title }).subscribe({
      next: (res) => {
        this.tasks.update((list) => [res.task, ...list]);
        this.newTitle.set('');
        this.loading.set(false);
        this.animateNewItem();
      },
      error: () => this.loading.set(false),
    });
  }

  private addTaskWithAI(input: string): void {
    this.loading.set(true);
    this.aiParsing.set(true);

    this.aiService.parseNatural(input).subscribe({
      next: (parsed) => {
        this.taskService.createTask({
          title: parsed.title,
          priority: parsed.priority,
          due_date: parsed.due_date,
        }).subscribe({
          next: (res) => {
            this.tasks.update((list) => [res.task, ...list]);
            this.newTitle.set('');
            this.loading.set(false);
            this.aiParsing.set(false);
            this.animateNewItem();
          },
          error: () => {
            this.loading.set(false);
            this.aiParsing.set(false);
          },
        });
      },
      error: () => {
        this.addTaskDirect(input);
      },
    });
  }

  private animateNewItem(): void {
    setTimeout(() => {
      const list = this.listRef()?.nativeElement;
      if (list) {
        const firstItem = list.querySelector('.task-item');
        if (firstItem) {
          gsap.from(firstItem, {
            autoAlpha: 0,
            y: -10,
            scale: 0.98,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    });
  }

  prioritizeWithAI(): void {
    this.loading.set(true);
    this.aiService.prioritize().subscribe({
      next: () => {
        this.loadTasks();
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
    const list = this.listRef()?.nativeElement;
    const item = list?.querySelector(`[data-task-id="${id}"]`);

    if (item) {
      gsap.to(item, {
        autoAlpha: 0,
        x: -20,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          this.taskService.deleteTask(id).subscribe({
            next: () => this.tasks.update((list) => list.filter((t) => t.id !== id)),
          });
        },
      });
    } else {
      this.taskService.deleteTask(id).subscribe({
        next: () => this.tasks.update((list) => list.filter((t) => t.id !== id)),
      });
    }
  }

  clearCompleted(): void {
    const done = this.tasks().filter((t) => t.status === 'done');
    for (const task of done) {
      this.deleteTask(task.id);
    }
  }

  setFilter(f: TaskStatus | 'all'): void {
    this.filter.set(f);
    setTimeout(() => this.animateList());
  }

  priorityClass(p: string): string {
    return `priority--${p}`;
  }

  toggleAiMode(): void {
    this.aiMode.update((v) => !v);
  }
}
