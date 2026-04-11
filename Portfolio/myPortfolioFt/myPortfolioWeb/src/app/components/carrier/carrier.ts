import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CareerStep {
  date: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-carrier',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="carrier-section">
      <h2 class="section-title">My trayectory</h2>

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
      display: flex;
      flex-direction: column;
      gap: 3rem;
      align-items: center;
    }

    .timeline-item {
      display: grid;
      /* 180px Date | Flexible Card | 180px Spacer */
      grid-template-columns: 180px 1fr 180px;
      gap: 2rem;
      align-items: center;
      width: 100%;
      max-width: 1100px;
    }

    .event-date {
      text-align: right;
      font-weight: bold;
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      writing-mode: vertical-lr;
      transform: rotate(180deg);
      white-space: nowrap;
      transition: color 0.3s ease; /* Smooth transition for your hover */
    }

    .event-date:hover {
      color: white;
    }

    .carrier-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2.5rem;
      transition: transform 0.3s ease, background 0.3s ease; /* Smooth transition for hover effects */
    }

    .carrier-card:hover {
      transform: scale(1.04);
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .carrier-card h3 {
      font-size: 1.7rem;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }

    .carrier-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
    }

  

    @media (max-width: 900px) {
      .timeline-item {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .event-date {
        writing-mode: horizontal-tb;
        transform: none;
        text-align: center;
        margin-bottom: -1rem;
      }
    }
  `
})
export class Carrier {
  careerSteps = signal<CareerStep[]>([
    {
      date: 'September - May 2024',
      title: 'DAM beginnings',
      description: 'I started Superior Grade of Cross-platform in La Algaba(Seville). I have learned knowledge about programming languages like HTML, CSS, Java, Python, XML, MySQL.'
    },
    {
      date: 'May - June 2025',
      title: 'Enterprise practices (Atos/Eviden)',
      description: 'I have done a period of one month of practices on Atos(Eviden), where I learned some knowledge about Java with JPA, Hibernate and Spring boot.'
    },
    {
      date: 'September - May 2026',
      title: '2DAM',
      description: 'Now I’m using new programming languages like JavaScript, TypeScript, Angular, Spring Boot in Java, MongoDB, OraclePL/SQL.'
    },
    {
      date: 'February - May 2026',
      title: 'Enterprise practices (Atos/Eviden)',
      description: 'I am doing enterprise in the same enterprise like last year, Atos(Eviden). This year they put me in their ferrovial project using Azure DevOps.'
    }
  ]);
}