import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="portfolio-wrapper">
      <div class="title-content">
        <h1>Personal portfolio</h1>
        <h2>Carlos Rodriguez Lobato || Software developer</h2>
        <p class="subtitle">
          Hi! Welcome. This is my portfolio. Here you will see things about me and my carrier as a software developer. 
          Hop you enjoy!!!
        </p>
      </div>
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

    .title-content {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0 1rem;
    }

    h1 {
      font-size: clamp(2.5rem, 10vw, 4.5rem);
      margin-bottom: 0.2rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    .h2 {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      margin-bottom: 1rem;
      font-weight: 400;
      color: #ddd;
      text-style: italic;
    }

    .subtitle {
      font-size: 1.1rem;
      max-width: 600px;
      line-height: 1.6;
      opacity: 0.85;
      margin: 0 auto;
      text-style: italic;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .subtitle { font-size: 1rem; }
    }
  `
})
export class Welcome {}
