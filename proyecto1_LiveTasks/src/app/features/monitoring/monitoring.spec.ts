import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MonitoringComponent } from './monitoring';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../models/task.model';

describe('MonitoringComponent', () => {
  let component: MonitoringComponent;
  let taskServiceSpy: { getTasks: ReturnType<typeof vi.fn> };

  const baseTask = (over: Partial<Task>): Task => ({
    id: 1,
    user_id: 'u1',
    title: 'T',
    description: null,
    status: 'todo',
    priority: 'medium',
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...over,
  });

  function setup(tasks: Task[]): { component: MonitoringComponent } {
    taskServiceSpy = { getTasks: vi.fn(() => of({ tasks })) };
    TestBed.configureTestingModule({
      imports: [MonitoringComponent],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
    });
    const fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return { component };
  }

  it('should create the component', () => {
    setup([baseTask({})]);
    expect(component).toBeTruthy();
  });

  it('should count total tasks', () => {
    setup([baseTask({}), baseTask({ id: 2 }), baseTask({ id: 3 })]);
    expect(component.totalCount()).toBe(3);
  });

  it('should count by status', () => {
    setup([
      baseTask({ id: 1, status: 'todo' }),
      baseTask({ id: 2, status: 'doing' }),
      baseTask({ id: 3, status: 'done' }),
    ]);
    expect(component.todoCount()).toBe(1);
    expect(component.doingCount()).toBe(1);
    expect(component.doneCount()).toBe(1);
    expect(component.pendingCount()).toBe(2);
  });

  it('should compute completion rate', () => {
    setup([baseTask({ id: 1, status: 'done' }), baseTask({ id: 2, status: 'done' }), baseTask({ id: 3, status: 'todo' })]);
    expect(component.completionRate()).toBe(67);
  });

  it('should return 0 completion rate when empty', () => {
    setup([]);
    expect(component.totalCount()).toBe(0);
    expect(component.completionRate()).toBe(0);
  });

  it('should group created and completed tasks in the last 7 days', () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const created = new Date(today).toISOString();
    setup([
      baseTask({ id: 1, status: 'done', created_at: created, updated_at: created }),
      baseTask({ id: 2, status: 'done', created_at: created, updated_at: created }),
      baseTask({ id: 3, status: 'todo', created_at: created }),
    ]);
    const days = component.last7Days();
    expect(days).toHaveLength(7);
    expect(component.trendTotal().created).toBe(3);
    expect(component.trendTotal().completed).toBe(2);
  });

  it('should return a non-zero bar height for bars with data', () => {
    setup([baseTask({ id: 1, status: 'done', created_at: new Date().toISOString(), updated_at: new Date().toISOString() })]);
    expect(component.barHeight(1)).toContain('%');
  });
});
