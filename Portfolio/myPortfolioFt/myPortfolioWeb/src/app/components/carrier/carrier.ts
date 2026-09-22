import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { TranslatePipe } from '@ngx-translate/core';

interface CareerStep {
  dateKey: string;
  titleKey: string;
  descriptionKey: string;
}

interface TechTool {
  name: string;
  src: string;
}

interface TechCategory {
  titleKey: string;
  tools: TechTool[];
}

@Component({
  selector: 'app-carrier',
  standalone: true,
  imports: [ScrollRevealDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="carrier-section" appScrollReveal>
      <h2 class="section-title">{{ 'CARRIER.SECTION_TITLE' | translate }}</h2>

      <div class="timeline-list">
        @for (item of careerSteps(); track item.titleKey; let i = $index) {
          <article class="timeline-item" [class.is-active]="i === 0">
            <div class="timeline-marker" aria-hidden="true">
              <span class="marker-dot"></span>
            </div>

            <div class="timeline-content">
              <span class="status-badge status-live">{{ item.dateKey | translate }}</span>

              <h3>{{ item.titleKey | translate }}</h3>
              <p>{{ item.descriptionKey | translate }}</p>
            </div>
          </article>
        }
      </div>

      <div class="tech-section">
        <h3 class="tech-heading">{{ 'CARRIER.TECH_STACK' | translate }}</h3>

        <div class="tech-cards">
          @for (category of techCategories(); track category.titleKey) {
            <div class="tech-card">
              <h4 class="tech-card-title">{{ category.titleKey | translate }}</h4>
              <div class="tech-tools">
                @for (tool of category.tools; track tool.name) {
                  <img
                    [src]="tool.src"
                    [attr.alt]="'CARRIER.LOGO_ALT' | translate: { name: tool.name }"
                    width="70"
                    height="70"
                    loading="lazy"
                    class="tech-tool-img"
                  />
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .carrier-section {
      padding: 6rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      color: white;
    }

    .section-title {
      text-align: center;
      font-size: clamp(2.2rem, 4vw, 3rem);
      margin-bottom: 3rem;
      font-weight: 800;
      letter-spacing: -0.04em;
    }

    .timeline-list {
      position: relative;
      max-width: 980px;
      margin: 0 auto;
      padding-left: 0.5rem;
    }

    .timeline-list::before {
      content: '';
      position: absolute;
      left: 18px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: rgba(122, 138, 164, 0.28);
    }

    .timeline-item {
      position: relative;
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr);
      gap: 1.5rem;
      align-items: flex-start;
      padding: 1.5rem 0;
    }

    .timeline-marker {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      margin-top: 0.4rem;
      border-radius: 50%;
      border: 2px solid rgba(91, 154, 255, 0.9);
      background: rgba(9, 14, 22, 0.9);
      z-index: 1;
      box-shadow: 0 0 18px rgba(74, 227, 255, 0.12);
    }

    .marker-dot {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: transparent;
      transition: background 0.2s ease;
    }

    .timeline-item.is-active .timeline-marker {
      border-color: rgba(74, 227, 255, 0.9);
      background: rgba(74, 227, 255, 0.12);
      box-shadow: 0 0 22px rgba(74, 227, 255, 0.28);
    }

    .timeline-item.is-active .marker-dot {
      background: #4ae3ff;
    }

    .timeline-content {
      padding-top: 0.2rem;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.45rem 0.9rem;
      border-radius: 0.8rem;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.02);
      color: #dfe9ff;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.95;
    }

    .status-live {
      border-color: rgba(74, 227, 255, 0.7);
      color: #a3ecff;
      box-shadow: inset 0 0 0 1px rgba(74, 227, 255, 0.15);
    }

    .timeline-content h3 {
      margin: 1rem 0 0.75rem;
      font-size: 30px;
      line-height: 1.08;
      letter-spacing: -0.05em;
      font-weight: 800;
      color: #f7f8fb;
    }

    .timeline-content p {
      margin: 0;
      max-width: 820px;
      color: rgba(255, 255, 255, 0.78);
      line-height: 1.65;
      font-size: 18px;
      letter-spacing: -0.01em;
    }

    .tech-section {
      margin-top: 5rem;
    }

    .tech-heading {
      text-align: center;
      font-size: 2.2rem;
      margin: 0 0 3rem;
    }

    .tech-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      align-items: stretch;
    }

    .tech-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2rem;
      transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
    }

    .tech-card:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .tech-card-title {
      text-align: center;
      font-size: 1.4rem;
      margin: 0 0 1.5rem;
      color: #4ae3ff;
    }

    .tech-tools {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1.25rem;
    }

    .tech-tool-img {
      width: 70px;
      height: 70px;
      object-fit: contain;
      transition: transform 0.4s ease;
    }

    .tech-tool-img:hover {
      transform: scale(1.1);
    }

    @media (max-width: 900px) {
      .timeline-item {
        grid-template-columns: 34px minmax(0, 1fr);
      }

      .tech-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .timeline-list::before {
        left: 15px;
      }

      .timeline-item {
        gap: 1rem;
      }

      .timeline-marker {
        width: 28px;
        height: 28px;
      }

      .status-badge {
        letter-spacing: 0.12em;
      }

      .tech-cards {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .carrier-section {
        padding: 3rem 1rem;
      }

      .section-title {
        margin-bottom: 2rem;
      }

      .timeline-content h3 {
        font-size: 1.95rem;
      }

      .timeline-content p {
        font-size: 1rem;
      }

      .tech-heading {
        font-size: 1.8rem;
      }

      .tech-tool-img {
        width: 60px;
        height: 60px;
      }
    }
  `
})
export class CarrierComponent {
  careerSteps = signal<CareerStep[]>([
    {
      dateKey: 'CARRIER.STEP4.DATE',
      titleKey: 'CARRIER.STEP4.TITLE',
      descriptionKey: 'CARRIER.STEP4.DESC'
    },
    {
      dateKey: 'CARRIER.STEP3.DATE',
      titleKey: 'CARRIER.STEP3.TITLE',
      descriptionKey: 'CARRIER.STEP3.DESC'
    },
    {
      dateKey: 'CARRIER.STEP2.DATE',
      titleKey: 'CARRIER.STEP2.TITLE',
      descriptionKey: 'CARRIER.STEP2.DESC'
    },
    {
      dateKey: 'CARRIER.STEP1.DATE',
      titleKey: 'CARRIER.STEP1.TITLE',
      descriptionKey: 'CARRIER.STEP1.DESC'
    }
  ]);

  techCategories = signal<TechCategory[]>([
    {
      titleKey: 'CARRIER.CATEGORIES.LANGUAGES',
      tools: [
        { name: 'Java', src: 'assets/java.png' },
        { name: 'Python', src: 'assets/python.png' },
        { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
        { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' }
      ]
    },
    {
      titleKey: 'CARRIER.CATEGORIES.FRONTEND',
      tools: [
        { name: 'Angular', src: 'assets/angular.png' },
        { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
        { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' }
      ]
    },
    {
      titleKey: 'CARRIER.CATEGORIES.BACKEND',
      tools: [
        { name: 'Spring Boot', src: 'assets/springboot.png' },
        { name: 'Node.js', src: 'assets/node.png' }
      ]
    },
    {
      titleKey: 'CARRIER.CATEGORIES.DATABASES',
      tools: [
        { name: 'MongoDB', src: 'assets/mongo.png' },
        { name: 'MySQL', src: 'assets/mysql.png' },
        { name: 'Oracle', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg' }
      ]
    },
    {
      titleKey: 'CARRIER.CATEGORIES.CLOUD_DEVOPS',
      tools: [
        { name: 'Azure', src: 'assets/azure.png' },
        { name: 'Azure DevOps', src: 'assets/azureDevOps.png' },
        { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
        { name: 'GitHub Actions', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg' },
        { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
        { name: 'GitHub Copilot', src: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/githubcopilot.svg' },
        { name: 'CodeQL', src: 'assets/codeql.jpeg' },
        { name: 'Bash', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyP4JtzOYMzhzxw4SGDXrNi9Eey-yVGMEK6cSvm1jGtx8MgDeA-7BXQuaq&s=10' }
      ]
    }
  ]);
}

