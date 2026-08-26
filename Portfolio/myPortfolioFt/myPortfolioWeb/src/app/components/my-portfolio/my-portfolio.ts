import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AboutComponent } from '../about-me/about-me';
import { CarrierComponent } from '../carrier/carrier';
import { ProjectsComponent } from '../my-projects/my-projects';
import { WelcomeComponent } from '../welcome/welcome';

@Component({
  selector: 'app-my-portfolio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AboutComponent, CarrierComponent, ProjectsComponent, WelcomeComponent],
  template: `
    <div class="portfolio">
      <app-welcome />
      <app-about />
      <app-carrier />
      <app-projects />

      <footer class="portfolio-footer">
        <p>Portfolio realized by Carlos Rodríguez Lobato. |
        Contact me -> <a href="mailto:rodlobcarlos@gmail.com">rodlobcarlos@gmail.com</a></p>
      </footer>
    </div>

  `,

  styles: `
  .portfolio {
      position: relative;
      z-index: 1;
      font-family: 'Karla', system-ui, sans-serif;
      cursor: default;

    }

    .portfolio-footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: auto;
      min-height: 3%;
      padding: 1.5rem 1rem;
      background: rgba(0, 0, 0, 0.6);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
      font-size: 0.9rem;
      margin-top: 4rem;
      box-sizing: border-box;
    }

    .portfolio-footer a {
      color: #fff;
      text-decoration: none;
    }

    .portfolio-footer a:hover {
      color: #1e90ff;
      transition: color 0.3s ease;
    }

    .portfolio-footer p {
      font-weight: bold;
      margin: 0;
      word-wrap: break-word;
      word-break: break-word;
    }

    p {
      margin: 0.1rem 0;
      text-align: center;
    }

    @media (max-width: 768px) {
      .subtitle {
        font-size: 1rem;
      }

      .portfolio {
        padding-bottom: 8rem;
      }

      .portfolio-footer {
        min-height: auto;
        padding: 1rem 0.5rem;
        font-size: 0.8rem;
      }

      .portfolio-footer p {
        line-height: 1.4;
      }
    }
  `
})
export class MyPortfolioComponent {}
