import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { ProjectsApi } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import {
  PROJECT_STATUS_LABELS,
  Project,
  ProjectStats,
  ProjectStatus,
} from '../../core/models';

interface StatusCount {
  key: ProjectStatus;
  label: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly api = inject(ProjectsApi);
  protected readonly auth = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly projects = signal<Project[]>([]);
  protected readonly statsByProject = signal<Record<number, ProjectStats>>({});

  protected readonly statusLabels = PROJECT_STATUS_LABELS;

  protected readonly totals = computed(() => {
    const projects = this.projects();
    const stats = Object.values(this.statsByProject());
    return {
      projects: projects.length,
      active: projects.filter((p) => p.status === 'in_progress').length,
      completed: projects.filter((p) => p.status === 'completed').length,
      planned: projects.filter((p) => p.status === 'planned').length,
      tasks: stats.reduce((acc, s) => acc + s.total_tasks, 0),
      doneTasks: stats.reduce((acc, s) => acc + s.completed_tasks, 0),
      pendingTasks: stats.reduce((acc, s) => acc + s.pending_tasks, 0),
      overdue: stats.reduce((acc, s) => acc + s.overdue_tasks, 0),
      hours: stats.reduce((acc, s) => acc + s.estimated_hours, 0),
      avgProgress: projects.length
        ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
        : 0,
    };
  });

  protected readonly statusBreakdown = computed<StatusCount[]>(() => {
    const projects = this.projects();
    return (Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[])
      .map((key) => ({
        key,
        label: PROJECT_STATUS_LABELS[key],
        total: projects.filter((p) => p.status === key).length,
      }))
      .filter((item) => item.total > 0);
  });

  protected readonly recent = computed(() =>
    [...this.projects()].sort((a, b) => b.id - a.id).slice(0, 5),
  );

  protected readonly taskPct = computed(() => {
    const { tasks, doneTasks } = this.totals();
    return tasks ? Math.round((doneTasks / tasks) * 100) : 0;
  });

  protected readonly maxStatus = computed(() =>
    Math.max(1, ...this.statusBreakdown().map((item) => item.total)),
  );

  ngOnInit(): void {
    this.api.listProjects({ page_size: 100, order_by: 'updated_at', order: 'desc' }).subscribe({
      next: (page) => {
        this.projects.set(page.items);
        this.loading.set(false);
        if (page.items.length) {
          this.loadStats(page.items);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(AuthService.message(err));
      },
    });
  }

  private loadStats(projects: Project[]): void {
    forkJoin(
      projects.map((project) =>
        // Un stats fallido no debe tumbar todo el dashboard
        this.api.getStats(project.id).pipe(catchError(() => of<ProjectStats | null>(null))),
      ),
    ).subscribe((results) => {
      const map: Record<number, ProjectStats> = {};
      projects.forEach((project, index) => {
        const value = results[index];
        if (value) {
          map[project.id] = value;
        }
      });
      this.statsByProject.set(map);
    });
  }
}
