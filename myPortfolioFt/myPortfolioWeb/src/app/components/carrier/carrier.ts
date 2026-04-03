import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-carrier',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <section class="carrier-section">
      <h2 class="section-title">My carrier</h2>

      <div class="cards-column">
        <div class="first-card">
          <h3> DAM beginnings </h3>
          <p>
            I started Superior Grade of Cross-platform  in La Algaba(Seville).
            I have learned knowledge about programming languages like HTML,CSS, Java,Python,XML,MySQL.   
          </p>
        </div>

        <div class="second-card">
          <h3> Enterprise pratices (Atos/Eviden) </h3>
          <p>
            I have done a period of one month of practices on Atos(Eviden),
            where I learned some knowledge about Java with JPA, Hibernate and Spring boot.  
          </p>
        </div>

        <div class="third-card">
          <h3> 2DAM </h3>
          <p>
            Now I’m using new programming languages like JavaScript, TypeScript, Angular, Spring Boot in Java, MongoDB, OraclePL/SQL. 
            For the final grade project I’m doing a personal task management, with Android Studio for mobile app and Angular for web site.    
          </p>
        </div>

        <div class="four-card">
          <h3> Enterprise practices (Atos/Eviden) </h3>
          <p>
            I am doing enterprise in the same enterprise like last year, Atos(Eviden). 
            This year they put me in their ferrovial project, where I were using Azure DevOps to control all the project we have. 
            I’m learning knowledge's of pipelines boards with kamban method, artifacts and repos synchronized with Github.   
          </p>
        </div>
      </div>
    </section>   
  `,

  styles: `
    carrier-section {
      padding: 6rem 2rem;
      max-width: 1100px;
      margin: 0 auto;
      color: white;
    }

    .section-title {
      text-align: center;
      font-size: 3rem;
      margin-bottom: 4rem;
    }

    .cards-column {
      display: flex;
      flex-direction: column;
      gap: 2rem; /* Space between the two cards */
      align-items: center; /* Vertical centering */
    }

    .first-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2.5rem;
      width: 30%;
    }

    .first-card h3 {
      font-size: 1.7rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .first-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
    }

    .second-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2.5rem;
      width: 30%;

    }

    .second-card h3{
      font-size: 1.7rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .second-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
    }

    .third-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2.5rem;
      width: 30%;

    }

    .third-card h3{
      font-size: 1.7rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .third-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
    }

    .four-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2.5rem;
      width: 30%;

    }

    .four-card h3{
      font-size: 1.7rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .four-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
    }
  `
})
export class Carrier {}
