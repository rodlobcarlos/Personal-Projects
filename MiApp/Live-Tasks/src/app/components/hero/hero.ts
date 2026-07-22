import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-container">
      <h1 class="title">Live&Tasks</h1>
      <p class="subtitle">Organiza tu vida como nunca lo habías hecho, fácil e intuitivo.</p>
    </section>
  `,
  styles: [`
    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 1rem;
      flex: 1;
    }

    .title {
      color: #43a4c7;
      font-size: clamp(3.5rem, 8vw, 6rem);
      font-weight: 900;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: #3f9ebc;
      font-size: clamp(1.1rem, 2.5vw, 1.6rem);
      font-weight: 700;
      margin-top: 1rem;
      max-width: 800px;
    }
  `]
})
export class HeroComponent {}