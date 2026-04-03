import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AboutComponent } from '../about-me/about-me';
import { Carrier } from '../carrier/carrier';

@Component({
  selector: 'app-my-portfolio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AboutComponent, Carrier],
  template: `
    <div class="portfolio-wrapper">
      
      <section class="welcome-section">
        <div class="hero-content">
          <h1>Hi! Welcome</h1>
          <p class="subtitle">
            This is my portfolio. Here you will see things about me and my carrier as a software developer. 
            Hop you enjoy!!!
          </p>
        </div>
      </section>
      
      <app-about />
      <app-carrier />

      <footer class="portfolio-footer">
        <p>Portfolio realized by Carlos Rodríguez Lobato. This web will be always update :)</p>
      </footer>
    </div>
  `,

  styles: `
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .portfolio-wrapper {
      position: relative;
      z-index: 1; /* Ensures text is above the space background component */
      color: white;
    }

    /* Welcome Section Styling */
    .welcome-section {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0 1rem;
    }

    h1 {
      font-size: clamp(2.5rem, 8vw, 4.5rem);
      margin-bottom: 1.5rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    .subtitle {
      font-size: 1.1rem;
      max-width: 600px;
      line-height: 1.6;
      opacity: 0.85;
      margin: 0 auto;
    }

    /* Footer Styling */
    .portfolio-footer {
      position: fixed;
      left: 0;
      bottom:0;
      width: 100%;
      padding: 2.5rem 0;
      background: rgba(0, 0, 0, 0.25);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
      font-size: 0.9rem;
      margin-top: 4rem;
      font-weight: bold;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .subtitle { font-size: 1rem; }
    }
  `
})
export class MyPortfolioComponent {}