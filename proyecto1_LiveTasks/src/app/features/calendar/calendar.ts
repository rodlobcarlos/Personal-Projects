import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskStateService } from '../../core/services/task-state.service';
import { AiService } from '../../core/services/ai.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [TranslatePipe, DatePipe, TitleCasePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class CalendarComponent {
  private readonly taskState = inject(TaskStateService);
  private readonly aiService = inject(AiService);

  readonly tasks = computed(() => this.taskState.tasks());
  readonly currentDate = signal(new Date());
  readonly selectedDate = signal<Date | null>(null);
  readonly aiSummary = signal<string | null>(null);
  readonly summaryLoading = signal(false);
  readonly loadError = signal(false);

  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  readonly monthLabel = computed(() => {
    const d = this.currentDate();
    return d.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  });

  readonly calendarDays = computed(() => {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevMonthLast = new Date(year, month, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLast.getDate() - i);
      days.push(this.buildDay(date, false, today));
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push(this.buildDay(date, true, today));
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push(this.buildDay(date, false, today));
    }

    return days;
  });

  readonly selectedDayTasks = computed(() => {
    const selected = this.selectedDate();
    if (!selected) return [];
    return this.tasks().filter((t) => {
      if (!t.due_date) return false;
      const due = new Date(t.due_date);
      return (
        due.getFullYear() === selected.getFullYear() &&
        due.getMonth() === selected.getMonth() &&
        due.getDate() === selected.getDate()
      );
    });
  });

  constructor() {
    if (this.taskState.tasks().length === 0) {
      this.loadTasks();
    }
  }

  private buildDay(date: Date, isCurrentMonth: boolean, today: Date): CalendarDay {
    const dateNormalized = new Date(date);
    dateNormalized.setHours(0, 0, 0, 0);

    const tasks = this.tasks().filter((t) => {
      if (!t.due_date) return false;
      const due = new Date(t.due_date);
      return (
        due.getFullYear() === date.getFullYear() &&
        due.getMonth() === date.getMonth() &&
        due.getDate() === date.getDate()
      );
    });

    return {
      date,
      day: date.getDate(),
      isCurrentMonth,
      isToday: dateNormalized.getTime() === today.getTime(),
      tasks,
    };
  }

  loadTasks(): void {
    this.taskState.loadTasks().then(() => this.loadError.set(false));
  }

  retry(): void {
    this.loadTasks();
  }

  prevMonth(): void {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() - 1);
    this.currentDate.set(d);
  }

  nextMonth(): void {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() + 1);
    this.currentDate.set(d);
  }

  selectDay(day: CalendarDay): void {
    this.selectedDate.set(day.date);
    this.aiSummary.set(null);
  }

  goToToday(): void {
    this.currentDate.set(new Date());
    this.selectedDate.set(new Date());
    this.aiSummary.set(null);
  }

  generateSummary(): void {
    const selected = this.selectedDate();
    if (!selected) return;

    this.summaryLoading.set(true);
    const dateStr = selected.toISOString().split('T')[0];

    this.aiService.dailySummary(dateStr).subscribe({
      next: (res) => {
        this.aiSummary.set(res.summary);
        this.summaryLoading.set(false);
      },
      error: () => this.summaryLoading.set(false),
    });
  }

  statusClass(status: string): string {
    return `task-status--${status}`;
  }
}
