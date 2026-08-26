import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';

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
          Hi! Welcome to my personal portfolio. Here you can find information about my skills, projects, and experiences.
          I hope you enjoy exploring it and learning more about me.
          If you have any questions or would like to get in touch, please feel free to contact me through the provided email address.
        </p>
        <div
          class="scroll-arrow"
          role="button"
          tabindex="0"
          (click)="scrollToNext()"
          (keydown.enter)="scrollToNext()"
          (keydown.space)="scrollToNext()"
          aria-label="Scroll to next section"
        >
          <svg viewBox="0 0 24 24" class="arrow-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="scrolledDown ? 'M20 6L9 17l-5-5' : 'M12 5v14M5 12l7 7 7-7'"
            />
          </svg>
        </div>
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
      z-index: 1;
      color: white;
      margin-top: -5rem;
      margin-bottom: -3rem;
    }

    .title-content {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0 1rem;
      position: relative;
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

    .title-content .subtitle {
      font-size: 1.1rem;
      max-width: 1000px;
      line-height: 1.6;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .subtitle { font-size: 1rem; }
    }

    .scroll-arrow {
      position: absolute;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c7d1d7;
      z-index: 5;
      margin-top: 5rem;
    }

    .scroll-arrow:focus-visible {
      outline: 2px solid #4ae3ff;
      outline-offset: 4px;
      border-radius: 4px;
    }

    .arrow-svg {
      width: 80px;
      height: 80px;
      display: block;
      transform-origin: center;
      transition: color 0.2s ease;
    }

    .scroll-arrow:hover { color: white; }
  `
})
export class WelcomeComponent {
  scrolledDown = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrolledDown = window.scrollY > 10;
  }

  scrollToNext(): void {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }
}
