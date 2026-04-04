import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AboutComponent } from '../about-me/about-me';
import { Carrier } from '../carrier/carrier';
import { ProjectsComponent } from '../my-projects/my-projects';
import { Welcome } from '../welcome/welcome';

@Component({
  selector: 'app-my-portfolio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AboutComponent, Carrier, ProjectsComponent, Welcome], 
  template: `
    <div class="portfolio">
      <app-welcome />
      <app-about />
      <app-carrier />
      <app-projects />

      <footer class="portfolio-footer">
        <p>Portfolio realized by Carlos Rodríguez Lobato. This web will be always update :)</p>
      </footer>
    </div>

  `,

  styles: `
  .portfolio {
      position: relative;
      z-index: 1; /* Keep text above the space stars */
      font-family: 'Karla', system-ui, sans-serif;
      cursor: default;

    }

    /* Footer Styling */
    .portfolio-footer {
      position: fixed;
      left: 0;
      bottom:0;
      width: 100%;
      height: 3%;
      padding: 2.5rem 0;
      background: rgba(0, 0, 0, 0.40);
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