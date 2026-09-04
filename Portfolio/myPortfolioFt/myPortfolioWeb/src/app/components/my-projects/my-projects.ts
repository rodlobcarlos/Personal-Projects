import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="projects-section" appScrollReveal>
      <h2 class="section-title">My projects 🖥️</h2>

      <div class="projects-grid">
        @for (project of projectService.projects(); track project.id) {
          <div class="project-card">
            <div class="card-content">
              <h3>{{ project.title }}</h3>

              <p class="description">
                {{ project.description }}
              </p>

              <div class="tech-stack">
                <span class="tech-tag">{{ project.techStack }}</span>
              </div>

              <div class="card-footer">
                <a [href]="project.github_url" target="_blank" rel="noopener noreferrer" class="github-btn">
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        } @empty {
          <div class="loading-state">
            <p>Fetching projects from the dark space...</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .projects-section {
      padding: 6rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      color: white;
      position: relative;
    }

    .section-title {
      text-align: center;
      font-size: 3rem;
      margin-bottom: 4rem;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
      justify-items: center;
    }

    .project-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2.5rem;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
    }

    .project-card:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .project-card h3 {
      font-size: 1.8rem;
      margin: 0 0 1rem 0;
      color: #fff;
    }

    .description {
      font-size: 1rem;
      line-height: 1.6;
      opacity: 0.8;
      margin-bottom: 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tech-stack {
      margin-bottom: 2rem;
    }

    .tech-tag {
      background: rgba(74, 227, 255, 0.1);
      color: #4ae3ff;
      padding: 0.4rem 0.8rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid rgba(74, 227, 255, 0.2);
    }

    .card-footer {
      margin-top: auto;
    }

    .github-btn {
      display: inline-block;
      padding: 0.7rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 12px;
      color: white;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      text-align: center;
    }

    .github-btn:hover {
      background: white;
      color: #090A0F;
      border-color: white;
    }

    .loading-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem;
      opacity: 0.5;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .projects-section {
        padding: 3rem 1rem;
        max-width: 100%;
      }

      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .projects-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .project-card {
        padding: 1.5rem;
      }

      .project-card h3 {
        font-size: 1.3rem;
      }

      .description {
        font-size: 0.95rem;
      }

      .tech-tag {
        font-size: 0.8rem;
      }

      .github-btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
      }
    }
  `
})
export class ProjectsComponent implements OnInit {
  public projectService = inject(ProjectService);

  ngOnInit(): void {
    this.projectService.loadProjects();
  }
}
