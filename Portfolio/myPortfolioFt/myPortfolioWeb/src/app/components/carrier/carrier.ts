import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface CareerStep {
  date: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-carrier',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="carrier-section" appScrollReveal>
      <h2 class="section-title">My trayectory 🚀</h2>

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
      <div class="description">
        <p>⬇️ These are the several tools that I have used with to this days. ⬇️
        You can see all on my profiles ⬆️!!</p>
      </div>
      <section class="image-container">
        <div class="python-image">
          <img src="assets/python.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="java-image">
          <img src="assets/java.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="angular-image">
          <img src="assets/angular.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="springboot-image">
          <img src="assets/springboot.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="mysql-image">
          <img src="assets/mysql.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="node-image">
          <img src="assets/node.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="mongo-image">
          <img src="assets/mongo.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="azure-image">
          <img src="assets/azure.png" alt="Space Stars Background" width="160" height="110" />
        </div>
        <div class="azureDevOps-image">
          <img src="assets/azureDevOps.png" alt="Space Stars Background" width="160" height="110" />
        </div>
      </section> 
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

    /* Two-per-row layout for timeline cards */
    .timeline-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem;
      align-items: start;
      justify-items: center;
    }

    .timeline-item {
      display: grid;
      /* Date column | Card column */
      grid-template-columns: 60px 1fr;
      gap: 1.5rem;
      align-items: center;
      width: 100%;
      max-width: 620px; /* Slightly wider to make cards more elongated */
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
      padding: 3rem; /* Increased padding to match About cards */
      min-height: 220px; /* Make cards more elongated */
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

    .image-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-top: 3rem;
      flex-wrap: wrap;
    }

    .image-container div:hover { 
      transform: scale(1.04); 
      transition: transform 0.4s ease; 
    }

    .description {
      text-align: center;
      font-size: 1.1rem;
      margin-top: 7rem;
      margin-bottom: 2rem;
    }

    /* Responsive: single column on smaller screens */
    @media (max-width: 900px) {
      .timeline-container { grid-template-columns: 1fr; }
      .timeline-item { grid-template-columns: 1fr; text-align: center; }
      .event-date { writing-mode: horizontal-tb; transform: none; text-align: center; margin-bottom: -1rem; }
    }

    @media (max-width: 768px) {
      .carrier-section { padding: 3rem 1rem; }
      .section-title { font-size: 2rem; margin-bottom: 2rem; }
      .timeline-item { max-width: 100%; gap: 1rem; }
      .carrier-card { padding: 1.5rem; }
      .carrier-card h3 { font-size: 1.3rem; }
      .carrier-card p { font-size: 0.95rem; }
      .event-date { font-size: 0.95rem; margin-bottom: 0.5rem; }
      .image-container { gap: 1rem; margin-top: 2rem; }
      .image-container img { width: 120px; height: 80px; }
      .description { font-size: 1rem; padding: 0 1rem; }
    }
  `
})
export class Carrier {
  careerSteps = signal<CareerStep[]>([
    {
      date: 'September 2024 - May 2025',
      title: '1ºDAM 📚',
      description: 'I started Superior Grade of Cross-platform in La Algaba(Seville). I have learned knowledge about programming languages like HTML, CSS, Java, Python, XML, MySQL.'
    },
    {
      date: 'May - June 2025',
      title: 'Enterprise practices (Atos/Eviden) 🏢',
      description: 'I have done a period of one month of practices on Atos(Eviden), where I learned some knowledge about Java with JPA, Hibernate and Spring boot.'
    },
    {
      date: 'September 2025 - May 2026',
      title: '2ºDAM 📚',
      description: 'In this period I used new programming languages like JavaScript, TypeScript, Angular, Spring Boot in Java, MongoDB, OraclePL/SQL. Also, I had done the final course project, a prototype about a personal management tasks with IA with Angular for web and Android Studio for mobile.'
    },
    {
      date: 'February - May 2026',
      title: 'Enterprise practices (Atos) 🏢',
      description: 'I am doing practices in the same enterprise like last year, Atos(Eviden). This year they put me in their real ferrovial project with the DevOps team. There I learned about DevOps, CI/CD, Jira, IaC and some knowledge about Azure portal/Azure DevOps to deploy applications on cloud infrastructure.'
    }
  ]);
}