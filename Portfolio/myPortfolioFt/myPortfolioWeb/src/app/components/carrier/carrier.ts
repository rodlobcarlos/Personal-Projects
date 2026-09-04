import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface CareerStep {
  date: string;
  title: string;
  description: string;
}

interface TechTool {
  name: string;
  src: string;
}

interface TechCategory {
  title: string;
  tools: TechTool[];
}

@Component({
  selector: 'app-carrier',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="carrier-section" appScrollReveal>
      <h2 class="section-title">My trajectory 🚀</h2>

      <div class="timeline-container">
        @for (item of careerSteps(); track item.title) {
          <div class="timeline-item">

            <div class="event-date">
              {{ item.date }}
            </div>

            <div class="carrier-card">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>

          </div>
        }
      </div>

      <div class="tech-section">
        <h3 class="tech-heading">Tech stack</h3>

        <div class="tech-cards">
          @for (category of techCategories(); track category.title) {
            <div class="tech-card">
              <h4 class="tech-card-title">{{ category.title }}</h4>
              <div class="tech-tools">
                @for (tool of category.tools; track tool.name) {
                  <img
                    [src]="tool.src"
                    [alt]="tool.name + ' logo'"
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
      font-size: 3rem;
      margin-bottom: 4rem;
    }

    .timeline-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem;
      align-items: start;
      justify-items: center;
    }

    .timeline-item {
      display: grid;
      grid-template-columns: 60px 1fr;
      gap: 1.5rem;
      align-items: center;
      width: 100%;
      max-width: 620px;
    }

    .event-date {
      text-align: right;
      font-weight: bold;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
      writing-mode: vertical-lr;
      transform: rotate(180deg);
      white-space: nowrap;
      transition: color 0.3s ease;
    }

    .event-date:hover { color: white; }

    .carrier-card {
      display: block;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 3rem;
      min-height: 220px;
      width: 110%;
      transition: transform 0.3s ease, background 0.3s ease;
      box-sizing: border-box;
    }

    .carrier-card:hover {
      transform: scale(1.04);
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .carrier-card h3 {
      font-size: 1.8rem;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .carrier-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
      font-size: 1rem;
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
      .timeline-container { grid-template-columns: 1fr; }
      .timeline-item { grid-template-columns: 1fr; text-align: center; }
      .event-date { writing-mode: horizontal-tb; transform: none; text-align: center; margin-bottom: -1rem; }
      .tech-cards { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .tech-cards { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .carrier-section { padding: 3rem 1rem; }
      .section-title { font-size: 2rem; margin-bottom: 2rem; }
      .timeline-item { max-width: 100%; gap: 1rem; }
      .carrier-card { padding: 1.5rem; }
      .carrier-card h3 { font-size: 1.3rem; }
      .carrier-card p { font-size: 0.95rem; }
      .event-date { font-size: 0.95rem; margin-bottom: 0.5rem; }
      .tech-heading { font-size: 1.8rem; }
      .tech-tool-img { width: 60px; height: 60px; }
    }
  `
})
export class CarrierComponent {
  careerSteps = signal<CareerStep[]>([
    {
      date: 'September 2024 - May 2025',
      title: '1 DAM 📚',
      description: 'I started Superior Grade of Cross-platform in La Algaba (Seville). I have learned knowledge about programming languages like HTML, CSS, Java, Python, XML, MySQL.'
    },
    {
      date: 'May - June 2025',
      title: 'Enterprise practices (Atos/Eviden) 🏢',
      description: 'I have done a period of one month of practices at Atos (Eviden), where I learned some knowledge about Java with JPA, Hibernate and Spring Boot.'
    },
    {
      date: 'September 2025 - May 2026',
      title: '2 DAM 📚',
      description: 'In this period I used new programming languages like JavaScript, TypeScript, Angular, Spring Boot in Java, MongoDB, Oracle PL/SQL. Also, I had done the final course project, a prototype about a personal management tasks with AI with Angular for web and Android Studio for mobile.'
    },
    {
      date: 'February - May 2026',
      title: 'Enterprise practices (Atos) 🏢',
      description: 'I am doing practices at the same enterprise as the previous year, Atos (Eviden). This year they put me in their real Ferrovial project with the DevOps team. There I learned about DevOps, CI/CD, Jira, IaC and some knowledge about Azure portal/Azure DevOps to deploy applications on cloud infrastructure.'
    }
  ]);

  techCategories = signal<TechCategory[]>([
    {
      title: 'Languages',
      tools: [
        { name: 'Java', src: 'assets/java.png' },
        { name: 'Python', src: 'assets/python.png' },
        { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
        { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' }
      ]
    },
    {
      title: 'Frontend',
      tools: [
        { name: 'Angular', src: 'assets/angular.png' },
        { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
        { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' }
      ]
    },
    {
      title: 'Backend',
      tools: [
        { name: 'Spring Boot', src: 'assets/springboot.png' },
        { name: 'Node.js', src: 'assets/node.png' }
      ]
    },
    {
      title: 'Databases',
      tools: [
        { name: 'MongoDB', src: 'assets/mongo.png' },
        { name: 'MySQL', src: 'assets/mysql.png' },
        { name: 'Oracle', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg' }
      ]
    },
    {
      title: 'Cloud & DevOps',
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

