import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

import { ProjectsComponent } from './my-projects';
import { Project, ProjectService } from '../../services/project';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  const projects = signal<Project[]>([
    {
      id: 1,
      title: 'Test project',
      description: 'A project description',
      techStack: 'Angular',
      github_url: 'https://github.com/example/project',
    },
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideTranslateService(),
        {
          provide: ProjectService,
          useValue: { projects, loadProjects: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the show-more button visible and toggles the description', () => {
    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;

    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.toggle-btn')).toBe(button);
  });
});
