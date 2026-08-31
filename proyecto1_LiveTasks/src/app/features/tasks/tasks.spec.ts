import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TasksComponent } from './tasks';
import { TaskService } from '../../core/services/task.service';
import { AiService } from '../../core/services/ai.service';
import { Task } from '../../models/task.model';

vi.mock('gsap', () => {
  const noopTween = () => ({});
  return {
    gsap: {
      to: (_t: unknown, vars: { onComplete?: () => void }) => {
        vars?.onComplete?.();
        return {};
      },
      from: noopTween,
      fromTo: noopTween,
      set: noopTween,
    },
  };
});

describe('TasksComponent', () => {
  let taskServiceSpy: {
    getTasks: ReturnType<typeof vi.fn>;
    createTask: ReturnType<typeof vi.fn>;
    updateTask: ReturnType<typeof vi.fn>;
    deleteTask: ReturnType<typeof vi.fn>;
  };
  let aiServiceSpy: { parseNatural: ReturnType<typeof vi.fn> };

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

  function setup(tasks: Task[]): TasksComponent {
    taskServiceSpy = {
      getTasks: vi.fn(() => of({ tasks })),
      createTask: vi.fn(() => of({ task: baseTask({ id: 99 }) })),
      updateTask: vi.fn((id: number, payload: object) =>
        of({ task: baseTask({ id, ...payload }) }),
      ),
      deleteTask: vi.fn(() => of(undefined)),
    };
    aiServiceSpy = { parseNatural: vi.fn(() => of({ title: 'IA', description: null, priority: 'high', due_date: null })) };

    TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AiService, useValue: aiServiceSpy },
      ],
    });
    const fixture = TestBed.createComponent(TasksComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    return comp;
  }

  it('should create the component', () => {
    expect(setup([])).toBeTruthy();
  });

  it('should load tasks on init', () => {
    const comp = setup([baseTask({ id: 1 }), baseTask({ id: 2 })]);
    expect(comp.tasks().length).toBe(2);
  });

  it('should count pending and completed', () => {
    const comp = setup([baseTask({ id: 1, status: 'todo' }), baseTask({ id: 2, status: 'done' }), baseTask({ id: 3, status: 'doing' })]);
    expect(comp.pendingCount()).toBe(2);
    expect(comp.completedCount()).toBe(1);
  });

  it('should filter tasks by status', () => {
    const comp = setup([baseTask({ id: 1, status: 'todo' }), baseTask({ id: 2, status: 'done' })]);
    expect(comp.filteredTasks().length).toBe(2);
    comp.setFilter('done');
    expect(comp.filteredTasks().length).toBe(1);
    expect(comp.filteredTasks()[0].id).toBe(2);
  });

  it('should add a task directly when not in AI mode', () => {
    const comp = setup([]);
    comp.aiMode.set(false);
    comp.newTitle.set('  Nueva tarea  ');
    comp.addTask();
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
      title: 'Nueva tarea',
      description: null,
      due_date: null,
      priority: 'medium',
    });
  });

  it('should not add empty task', () => {
    const comp = setup([]);
    comp.newTitle.set('   ');
    comp.addTask();
    expect(taskServiceSpy.createTask).not.toHaveBeenCalled();
  });

  it('should cycle status todo -> doing -> done -> todo', () => {
    const comp = setup([baseTask({ id: 1, status: 'todo' })]);
    comp.cycleStatus(comp.tasks()[0]);
    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(1, { status: 'doing' });
  });

  it('should delete a task', () => {
    const comp = setup([baseTask({ id: 1 }), baseTask({ id: 2 })]);
    comp.deleteTask(1);
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should clear completed tasks', () => {
    const comp = setup([baseTask({ id: 1, status: 'done' }), baseTask({ id: 2, status: 'todo' })]);
    comp.clearCompleted();
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(1);
    expect(taskServiceSpy.deleteTask).not.toHaveBeenCalledWith(2);
  });

  it('should report a due date as overdue', () => {
    const comp = setup([]);
    const past = new Date();
    past.setDate(past.getDate() - 2);
    const info = comp.getDueDateInfo(baseTask({ id: 1, due_date: past.toISOString() }));
    expect(info?.class).toBe('due--overdue');
  });

  it('should fall back to direct creation when AI parse fails', () => {
    const comp = setup([]);
    comp.aiMode.set(true);
    aiServiceSpy.parseNatural.mockReturnValue(throwError(() => new Error('fail')));
    comp.newTitle.set('Tarea');
    comp.addTask();
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
      title: 'Tarea',
      description: null,
      due_date: null,
      priority: 'medium',
    });
  });

  it('should fill the form with the AI suggestion before creating', () => {
    const comp = setup([]);
    comp.aiMode.set(true);
    aiServiceSpy.parseNatural.mockReturnValue(
      of({ title: 'Preparar informe', description: 'Resumen trimestral', priority: 'high', due_date: '2026-09-15' }),
    );
    comp.newTitle.set('Preparar el informe trimestral para mañana');
    comp.addTask();
    expect(taskServiceSpy.createTask).not.toHaveBeenCalled();
    expect(comp.aiSuggestion()).toBe(true);
    expect(comp.newTitle()).toBe('Preparar informe');
    expect(comp.newDescription()).toBe('Resumen trimestral');
    expect(comp.newPriority()).toBe('high');
    expect(comp.newDueDate()).toBe('2026-09-15');
  });

  it('should create the task with the edited form fields when AI suggestion is active', () => {
    const comp = setup([]);
    comp.aiMode.set(true);
    comp.newTitle.set('Preparar informe');
    comp.newDescription.set('Resumen trimestral');
    comp.newPriority.set('high');
    comp.newDueDate.set('2026-09-15');
    comp.aiSuggestion.set(true);
    comp.addTask();
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
      title: 'Preparar informe',
      description: 'Resumen trimestral',
      due_date: '2026-09-15',
      priority: 'high',
    });
  });

  it('should cancel the AI suggestion and reset the form', () => {
    const comp = setup([]);
    comp.aiMode.set(true);
    comp.newTitle.set('T');
    comp.newDescription.set('D');
    comp.newPriority.set('high');
    comp.newDueDate.set('2026-09-15');
    comp.aiSuggestion.set(true);
    comp.cancelAiSuggestion();
    expect(comp.aiSuggestion()).toBe(false);
    expect(comp.newTitle()).toBe('');
    expect(comp.newDescription()).toBe('');
    expect(comp.newDueDate()).toBe('');
    expect(comp.newPriority()).toBe('medium');
  });
});
