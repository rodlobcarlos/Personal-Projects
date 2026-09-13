import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="portfolio-wrapper">
      <div class="title-content">
        <h1>{{ 'WELCOME.TITLE' | translate }}</h1>
        <h2>{{ 'WELCOME.SUBTITLE' | translate }}</h2>
        <p class="subtitle">
          {{ 'WELCOME.PARAGRAPH' | translate }}
        </p>
        <button class="cv-button" type="button" (click)="downloadCV()">
          <svg class="cv-button-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
          </svg>
          {{ 'CV_BUTTON' | translate }}
        </button>
        <div
          class="scroll-arrow"
          role="button"
          tabindex="0"
          (click)="scrollToNext()"
          (keydown.enter)="scrollToNext()"
          (keydown.space)="scrollToNext()"
          [attr.aria-label]="'WELCOME.SCROLL_ARIA' | translate"
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
      padding-top: 4rem;
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

    .cv-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      margin-top: 1.75rem;
      padding: 0.8rem 1.35rem;
      border: 1px solid #4ae3ff;
      border-radius: 999px;
      background: rgba(74, 227, 255, 0.12);
      box-shadow: 0 0 0 rgba(74, 227, 255, 0);
      color: #4ae3ff;
      font: inherit;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease,
        transform 0.25s ease;
      text-align: center;
    }

    .cv-button:hover {
      background: #4ae3ff;
      color: #090A0F;
      box-shadow: 0 0 24px rgba(74, 227, 255, 0.28);
      transform: translateY(-2px);
    }

    .cv-button:focus-visible {
      outline: 2px solid #4ae3ff;
      outline-offset: 4px;
    }

    .cv-button:active {
      transform: translateY(0);
    }

    .cv-button-icon {
      width: 1.1rem;
      height: 1.1rem;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.8;
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

  downloadCV(): void {
    window.open('/assets/CV_Carlos%20Rodr%C3%ADguez%20Lobato.pdf', '_blank');
  }
}
