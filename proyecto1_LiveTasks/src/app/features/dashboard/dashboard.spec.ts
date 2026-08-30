import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard';
import { TasksComponent } from '../tasks/tasks';
import { CalendarComponent } from '../calendar/calendar';
import { MonitoringComponent } from '../monitoring/monitoring';
import { NotesComponent } from '../notes/notes';
import { TaskService } from '../../core/services/task.service';
import { AiService } from '../../core/services/ai.service';
import { NoteService } from '../../core/services/note.service';

describe('DashboardComponent', () => {
  function setup(): DashboardComponent {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TaskService, useValue: { getTasks: vi.fn(() => of({ tasks: [] })) } },
        { provide: AiService, useValue: { dailySummary: vi.fn(() => of({ summary: '' })), parseNatural: vi.fn(), prioritize: vi.fn() } },
        { provide: NoteService, useValue: { getNotes: vi.fn(() => of({ notes: [] })) } },
      ],
    }).overrideComponent(DashboardComponent, {
      remove: { imports: [TasksComponent, CalendarComponent, MonitoringComponent, NotesComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#tasks')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#calendar')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#monitoring')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#notes')).toBeTruthy();
    return component;
  }

  it('should create the dashboard', () => {
    expect(setup()).toBeTruthy();
  });

  it('should render the four section anchors', () => {
    const component = setup();
    expect(component).toBeTruthy();
  });
});
