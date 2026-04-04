import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  github_url: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="projects-section">
      <h2 class="section-title">My projects</h2>

      <div class="projects-grid">
        @for (project of projects(); track project.id) {
          <div class="project-card">
            <div class="card-content">
              <h3>{{ project.title }}</h3>
              
              <p class="description">{{ project.description }}</p>
              
              <div class="tech-stack">
                <span class="tech-tag">{{ project.tech_stack }}</span>
              </div>

              <div class="card-footer">
                <a [href]="project.github_url" target="_blank" class="github-btn">
                  View GitHub
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .projects-section {
      padding: 6rem 2rem;
      max-width: 1300px;
      margin: 0 auto;
      color: white;
    }

    .section-title {
      text-align: center;
      font-size: 3.5rem;
      margin-bottom: 4rem;
      cursor: default;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
    }

    .project-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, background 0.3s ease;
      cursor: default;
    }

    .project-card:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.2);
    }

    h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      color: #fff;
      cursor: default;
    }

    .description {
      font-size: 1rem;
      line-height: 1.6;
      opacity: 0.8;
      margin-bottom: 1.5rem;
      /* Limits description to 3 lines so cards stay even */
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      cursor: default;
    }

    .tech-tag {
      background: rgba(74, 227, 255, 0.1);
      color: #4ae3ff;
      padding: 0.4rem 0.8rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: bold;
      cursor: default;
    }

    .card-footer {
      margin-top: auto;
      padding-top: 1.5rem;
    }

    .github-btn {
      display: inline-block;
      color: white;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      transition: all 0.3s;
    }

    .github-btn:hover {
      background: white;
      color: black;
    }
  `
})
export class ProjectsComponent {
  // These objects now match your MySQL table structure
  projects = signal<Project[]>([
    {
      id: 1,
      title: 'Portfolio (In development)',
      description: 'Personal portfolio developed with Angular 19 and Spring Boot.',
      tech_stack: 'Angular, Java, MySQL',
      github_url: 'https://github.com/rodlobcarlos/Personal-Projects'
    },
    {
      id: 2,
      title: 'Task Management (In development)',
      description: 'A mobile and web application to manage daily tasks and productivity.',
      tech_stack: 'Android Studio, Angular, MongoDB',
      github_url: 'https://github.com/rodlobcarlos/...'
    }
  ]);
}