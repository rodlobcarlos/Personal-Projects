import { Component, computed, inject, signal } from '@angular/core';
import { TaskStateService } from '../../core/services/task-state.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DayTrend {
  label: string;
  created: number;
  completed: number;
}

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './monitoring.html',
  styleUrl: './monitoring.scss',
})
export class MonitoringComponent {
  private readonly taskState = inject(TaskStateService);

  readonly tasks = computed(() => this.taskState.tasks());
  readonly loadError = signal(false);

  readonly totalCount = computed(() => this.tasks().length);

  readonly todoCount = computed(() => this.tasks().filter((t) => t.status === 'todo').length);

  readonly doingCount = computed(() => this.tasks().filter((t) => t.status === 'doing').length);

  readonly doneCount = computed(() => this.tasks().filter((t) => t.status === 'done').length);

  readonly pendingCount = computed(() => this.todoCount() + this.doingCount());

  readonly completionRate = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.doneCount() / total) * 100);
  });

  readonly last7Days = computed<DayTrend[]>(() => {
    const allTasks = this.tasks();
    const days: DayTrend[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const label = date.toLocaleDateString('default', { weekday: 'short', day: 'numeric' });

      const created = allTasks.filter((t) => {
        const created = new Date(t.created_at);
        return created >= date && created < nextDate;
      }).length;

      const completed = allTasks.filter((t) => {
        if (t.status !== 'done') return false;
        const updated = new Date(t.updated_at);
        return updated >= date && updated < nextDate;
      }).length;

      days.push({ label, created, completed });
    }

    return days;
  });

  readonly createdThisWeek = computed(() =>
    this.last7Days().reduce((sum, d) => sum + d.created, 0),
  );

  readonly completedThisWeek = computed(() =>
    this.last7Days().reduce((sum, d) => sum + d.completed, 0),
  );

  readonly busiestDay = computed(() => {
    const days = this.last7Days();
    let best = days[0];
    for (const d of days) {
      if (d.created + d.completed > best.created + best.completed) best = d;
    }
    return best;
  });

  readonly maxTrendValue = computed(() => {
    const days = this.last7Days();
    let max = 1;
    for (const d of days) {
      if (d.created > max) max = d.created;
      if (d.completed > max) max = d.completed;
    }
    return max;
  });

  readonly trendTotal = computed(() => {
    const days = this.last7Days();
    const created = days.reduce((s, d) => s + d.created, 0);
    const completed = days.reduce((s, d) => s + d.completed, 0);
    return { created, completed };
  });

  constructor() {
    if (this.taskState.tasks().length === 0) {
      this.loadTasks();
    }
  }

  loadTasks(): void {
    this.taskState.loadTasks().then(() => this.loadError.set(false));
  }

  retry(): void {
    this.loadTasks();
  }

  barHeight(value: number): string {
    const max = this.maxTrendValue();
    const pct = max > 0 ? (value / max) * 100 : 0;
    return `${Math.max(pct, value > 0 ? 8 : 0)}%`;
  }
}
