import { Component, computed, inject, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../core/services/task.service';
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
  private readonly taskService = inject(TaskService);

  readonly tasks = signal<Task[]>([]);

  readonly totalCount = computed(() => this.tasks().length);

  readonly todoCount = computed(() => this.tasks().filter((t) => t.status === 'todo').length);

  readonly doingCount = computed(() => this.tasks().filter((t) => t.status === 'doing').length);

  readonly doneCount = computed(() => this.tasks().filter((t) => t.status === 'done').length);

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

  readonly maxTrendValue = computed(() => {
    const days = this.last7Days();
    let max = 1;
    for (const d of days) {
      if (d.created > max) max = d.created;
      if (d.completed > max) max = d.completed;
    }
    return max;
  });

  constructor() {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => this.tasks.set(res.tasks),
    });
  }

  barHeight(value: number): string {
    const max = this.maxTrendValue();
    const pct = max > 0 ? (value / max) * 100 : 0;
    return `${Math.max(pct, value > 0 ? 8 : 0)}%`;
  }
}
