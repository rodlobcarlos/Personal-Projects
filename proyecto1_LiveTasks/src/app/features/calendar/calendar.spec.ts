import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CalendarComponent } from './calendar';
import { TaskService } from '../../core/services/task.service';
import { AiService } from '../../core/services/ai.service';
import { Task } from '../../models/task.model';

describe('CalendarComponent', () => {
  let taskServiceSpy: { getTasks: ReturnType<typeof vi.fn> };
  let aiServiceSpy: { dailySummary: ReturnType<typeof vi.fn> };

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

  function setup(tasks: Task[], initialDate = new Date()): CalendarComponent {
    taskServiceSpy = { getTasks: vi.fn(() => of({ tasks })) };
    aiServiceSpy = { dailySummary: vi.fn(() => of({ summary: 'resumen' })) };
    TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AiService, useValue: aiServiceSpy },
      ],
    });
    const fixture = TestBed.createComponent(CalendarComponent);
    const comp = fixture.componentInstance;
    comp.currentDate.set(initialDate);
    fixture.detectChanges();
    return comp;
  }

  it('should create the component', () => {
    const comp = setup([]);
    expect(comp).toBeTruthy();
  });

  it('should build 42 calendar days', () => {
    const comp = setup([]);
    expect(comp.calendarDays().length).toBe(42);
  });

  it('should navigate between months', () => {
    const comp = setup([], new Date(2026, 7, 15));
    const before = comp.currentDate();
    comp.prevMonth();
    expect(comp.currentDate().getMonth()).toBe(before.getMonth() - 1);
    comp.nextMonth();
    expect(comp.currentDate().getMonth()).toBe(before.getMonth());
  });

  it('should filter tasks assigned to the selected day', () => {
    const today = new Date();
    const due = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const comp = setup([
      baseTask({ id: 1, due_date: due.toISOString() }),
      baseTask({ id: 2, due_date: new Date(2020, 0, 1).toISOString() }),
    ]);
    comp.selectedDate.set(due);
    expect(comp.selectedDayTasks().length).toBe(1);
    expect(comp.selectedDayTasks()[0].id).toBe(1);
  });

  it('should clear AI summary when selecting a day', () => {
    const comp = setup([]);
    comp.aiSummary.set('viejo');
    const day = comp.calendarDays().find((d) => d.isCurrentMonth)!;
    comp.selectDay(day);
    expect(comp.aiSummary()).toBeNull();
  });

  it('should generate an AI summary for the selected day', () => {
    const comp = setup([]);
    const day = comp.calendarDays().find((d) => d.isCurrentMonth)!;
    comp.selectDay(day);
    comp.generateSummary();
    expect(aiServiceSpy.dailySummary).toHaveBeenCalled();
  });

  it('should not generate a summary without a selected day', () => {
    const comp = setup([]);
    comp.generateSummary();
    expect(aiServiceSpy.dailySummary).not.toHaveBeenCalled();
  });

  it('should go to today', () => {
    const comp = setup([]);
    comp.goToToday();
    const t = new Date();
    expect(comp.currentDate().getFullYear()).toBe(t.getFullYear());
    expect(comp.currentDate().getMonth()).toBe(t.getMonth());
    expect(comp.selectedDate()).toBeTruthy();
  });
});
