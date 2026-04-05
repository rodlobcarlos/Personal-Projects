import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
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
    </div>
  `,

  styles: `
    :host {
      display: block;
      min-height: 100vh;
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

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .subtitle { font-size: 1rem; }
    }
  `
})
export class Welcome {}
