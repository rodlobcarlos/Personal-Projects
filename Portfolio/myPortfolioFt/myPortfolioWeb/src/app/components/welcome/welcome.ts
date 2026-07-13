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
        <h2>Carlos Rodríguez Lobato || Junior full-stack developer</h2>
        <p class="subtitle">
          Hi!👋🏼 Welcome to my personal portfolio. Here you can find information about my skills, projects, and experiences. 
          I hope you enjoy exploring it and learning more about me. 
          If you have any questions or would like to get in touch, please feel free to contact me through the provided email address.
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
      margin-top: -5rem; /* Adjust this value based on your header height */
      margin-bottom: -3rem; /* Adjust this value based on your footer height */
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

    .title-content h2 {
      margin-bottom: 1rem;
      font-style: italic;
    }

    .title-content subtitle {
      font-size: 1.1rem;
      max-width: 600px;
      line-height: 1.6;
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
