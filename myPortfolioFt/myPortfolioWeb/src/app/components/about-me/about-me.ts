import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <section class="about-section">
      <h2 class="section-title">About me!</h2>
      
      <div class="about-grid">
        <div class="photo-column">
          <div class="profile-pic-wrapper">
             <img ngSrc="assets/profile.jpg" alt="Carlos Rodríguez Lobato" width="350" height="350" priority>
          </div>
        </div>

        <div class="cards-column">
          <div class="info-card">
            <h3>Myself</h3>
            <p>
              I am Carlos Rodríguez Lobato, I'm cross-platform software developer. 
              I was born in Spain (Seville), I live in a town called Alcalá del Río. 
              I have one older sister too. I'm passionate of technology, I love my 
              sector and my job. I always been updating my knowledge's about coding 
              and the new technologies that are coming at this time.
            </p>
          </div>

          <div class="info-card social-card">
            <h3>Social media</h3>
            <ul class="social-links">
              <li><a href="https://www.instagram.com/rodlobcarlos/" target="_blank">Instagram</a></li>
              <li><a href="https://www.linkedin.com/in/carlos-rodr%C3%ADguez-lobato-211b27330/" target="_blank">Carlos Rodríguez Lobato | LinkedIn</a></li>
              <li><a href="https://github.com/rodlobcarlos" target="_blank">rodlobcarlos (Carlos Rodríguez Lobato) · GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .about-section {
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

    .about-grid {
      display: grid;
      /* Column 1: Photo area | Column 2: Cards area */
      grid-template-columns: 1fr 1.2fr; 
      gap: 3rem;
      align-items: center; /* Vertically centers the photo relative to the cards stack */
    }

    /* Left Column */
    .photo-column {
      display: flex;
      justify-content: center;
    }

    .profile-pic-wrapper img {
      border-radius: 50%;
      border: 5px solid rgba(255, 255, 255, 0.1);
      background: white; /* Matches your screenshot background for the cutout */
      object-fit: cover;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    /* Right Column (The Stack) */
    .cards-column {
      display: flex;
      flex-direction: column;
      gap: 2rem; /* Space between the two cards */
    }

    .info-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      padding: 2.5rem;
      transition: transform 0.3s ease;
    }

    .info-card h3 {
      font-size: 1.8rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .info-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
    }

    .info-card:hover {
      transform: scale(1.04);
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.2);

    }

    /* Social specific */
    .social-links {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    .social-links li {
      margin: 0.8rem 0;
    }

    .social-links a {
      color: #c7d1d7;
      text-decoration: none;
      transition: color 0.3s;
    }

    .social-links a:hover {
      color: white;
    }

    /* Responsive: Stack everything on mobile */
    @media (max-width: 900px) {
      .about-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .photo-column { margin-bottom: 2rem; }
    }
  `
})
export class AboutComponent {}