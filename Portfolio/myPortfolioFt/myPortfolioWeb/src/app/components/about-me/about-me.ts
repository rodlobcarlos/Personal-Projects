import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, ScrollRevealDirective],
  template: `
    <section class="about-section" appScrollReveal>
      <h2 class="section-title">About me! 🧑🏼‍💻</h2>

      <div class="about-grid">
        <div class="photo-block">
          <div class="photo-column">
            <div class="profile-pic-wrapper">
               <img ngSrc="assets/profile.jpg" alt="Carlos Rodríguez Lobato" width="350" height="350" priority>
            </div>
          </div>

          <div class="certificate-column">
            <h3>Certificates 🎓</h3>
              <img ngSrc="assets/github-foundations.svg" alt="GitHub Certification" width="80" height="80">
          </div>
        </div>

        <div class="cards-column">
          <div class="info-card">
            <h3>Myself 🎓</h3>
            <p>
              I am Carlos Rodríguez Lobato, a junior full-stack developer.
              I was born in Spain (Seville), I live in a town called Alcalá del Río (Seville).
              Right now, I'm specializing in DevOps.
              A work methodology that allows me to develop and deploy applications in a more efficient way and helps to improve the collaboration between development and operations teams in an organization.
            </p>
          </div>

          <div class="info-card social-card">
            <h3>Social media 📲</h3>
            <ul class="social-links">
              <li><a href="https://www.linkedin.com/in/carlos-rodr%C3%ADguez-lobato-211b27330/" target="_blank" rel="noopener noreferrer">Carlos Rodríguez Lobato · LinkedIn Profile</a></li>
              <li><a href="https://www.infojobs.net/candidate/cv/view/index.xhtml?codeCv=6d3c60ca-2f0c-4a0c-a65a-1b1e011a8b3a&dgv=795694009736341453" target="_blank" rel="noopener noreferrer">Carlos Rodríguez Lobato · InfoJobs Profile</a></li>
              <li><a href="https://github.com/rodlobcarlos" target="_blank" rel="noopener noreferrer">rodlobcarlos · GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .about-section {
      padding: 6rem 1.5rem;
      width: min(100%, 1200px);
      max-width: 1200px;
      margin: 0 auto;
      color: white;
      box-sizing: border-box;
    }

    .section-title {
      text-align: center;
      font-size: clamp(2.4rem, 4vw, 3rem);
      margin-bottom: 4rem;
    }

    .about-grid {
      display: grid;
      grid-template-columns: minmax(240px, 1fr) minmax(320px, 1.3fr);
      gap: 3rem;
      align-items: center;
      width: min(100%, 1100px);
      margin: 0 auto;
      box-sizing: border-box;
    }

    .photo-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
    }

    .photo-column {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .certificate-column {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 2rem;
      padding: 1.75rem;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
    }

    .certificate-column h3 {
      margin: 0 0 1rem;
      font-size: 1.6rem;
    }

    .certificate-column:hover {
      transform: scale(1.04);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .profile-pic-wrapper {
      width: min(100%, 360px);
      max-width: 360px;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      overflow: hidden;
      border: 5px solid rgba(255, 255, 255, 0.1);
      background: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .profile-pic-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .cards-column {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 2rem;
      padding: 2.5rem;
      width: 100%;
      min-height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
      box-sizing: border-box;
    }

    .info-card h3 {
      font-size: 1.8rem;
      margin: 0 0 1.5rem;
      text-align: center;
    }

    .info-card p {
      line-height: 1.7;
      opacity: 0.9;
      text-align: center;
      margin: 0;
    }

    .info-card:hover {
      transform: scale(1.04);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .social-links {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: center;
    }

    .social-links li {
      margin: 0.85rem 0;
    }

    .social-links a {
      color: #c7d1d7;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .social-links a:hover {
      color: white;
    }

    @media (max-width: 900px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }

      .about-section {
        padding: 4rem 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .about-section {
        padding: 3rem 1rem;
        width: 100%;
      }

      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .about-grid {
        width: min(100%, 740px);
      }

      .profile-pic-wrapper {
        width: 220px;
        max-width: 220px;
      }

      .info-card {
        padding: 1.75rem;
        min-height: auto;
      }

      .info-card h3 {
        font-size: 1.4rem;
      }

      .info-card p {
        font-size: 0.96rem;
      }
    }
  `
})
export class AboutComponent {}
