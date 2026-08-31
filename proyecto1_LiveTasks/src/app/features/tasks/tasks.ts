import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { TaskStateService } from '../../core/services/task-state.service';
import { AiService } from '../../core/services/ai.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, TranslatePipe, DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent implements AfterViewInit {
  private readonly taskState = inject(TaskStateService);
  private readonly aiService = inject(AiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly listRef = viewChild<ElementRef>('taskList');

  readonly tasks = computed(() => this.taskState.tasks());
  readonly filter = signal<TaskStatus | 'all'>('all');
  readonly newTitle = signal('');
  readonly newDescription = signal('');
  readonly newDueDate = signal('');
  readonly newPriority = signal<TaskPriority>('medium');
  readonly aiSuggestion = signal(false);
  readonly loading = signal(false);
  readonly aiMode = signal(false);
  readonly aiParsing = signal(false);
  readonly loadError = signal(false);

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

  readonly todoCount = computed(() =>
    this.tasks().filter((t) => t.status === 'todo').length,
  );

  readonly doingCount = computed(() =>
    this.tasks().filter((t) => t.status === 'doing').length,
  );

  constructor() {
    this.taskState.loadTasks().then(() => this.animateList());
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
    this.taskState.loadTasks().then(() => this.animateList());
  }

  retry(): void {
    this.loadTasks();
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
    this.taskState
      .createTask({
        title,
        description: this.newDescription().trim() || null,
        due_date: this.newDueDate() || null,
        priority: this.newPriority(),
      })
      .then((res) => {
        this.loading.set(false);
        if (res) {
          this.resetForm();
          this.animateNewItem();
        }
      });
  }

  private addTaskWithAI(input: string): void {
    if (this.aiSuggestion()) {
      this.commitAiTask();
      return;
    }

    this.loading.set(true);
    this.aiParsing.set(true);

    this.aiService.parseNatural(input).subscribe({
      next: (parsed) => {
        this.loading.set(false);
        this.aiParsing.set(false);
        this.newTitle.set(parsed.title);
        this.newDescription.set(parsed.description ?? '');
        this.newDueDate.set(parsed.due_date ?? '');
        this.newPriority.set(parsed.priority);
        this.aiSuggestion.set(true);
        this.animateNewItem();
      },
      error: () => {
        this.loading.set(false);
        this.aiParsing.set(false);
        this.addTaskDirect(input);
      },
    });
  }

  private commitAiTask(): void {
    this.loading.set(true);
    const title = this.newTitle().trim();
    if (!title) {
      this.loading.set(false);
      return;
    }
    this.taskState
      .createTask({
        title,
        description: this.newDescription().trim() || null,
        due_date: this.newDueDate() || null,
        priority: this.newPriority(),
      })
      .then((res) => {
        this.loading.set(false);
        if (res) {
          this.resetForm();
          this.animateNewItem();
        }
      });
  }

  cancelAiSuggestion(): void {
    this.aiSuggestion.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.newTitle.set('');
    this.newDescription.set('');
    this.newDueDate.set('');
    this.newPriority.set('medium');
    this.aiSuggestion.set(false);
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

    this.taskState.updateTask(task.id, { status: newStatus });
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
          this.taskState.deleteTask(id);
        },
      });
    } else {
      this.taskState.deleteTask(id);
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

  getDueDateInfo(task: Task): { label: string; class: string } | null {
    if (!task.due_date) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(task.due_date);
    due.setHours(0, 0, 0, 0);

    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'tasks.overdue', class: 'due--overdue' };
    if (diffDays === 0) return { label: 'tasks.dueToday', class: 'due--today' };
    if (diffDays === 1) return { label: 'tasks.dueTomorrow', class: 'due--tomorrow' };
    return { label: due.toLocaleDateString(), class: 'due--future' };
  }

  isOverdue(task: Task): boolean {
    if (!task.due_date || task.status === 'done') return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(task.due_date);
    due.setHours(0, 0, 0, 0);
    return due.getTime() < now.getTime();
  }
}
