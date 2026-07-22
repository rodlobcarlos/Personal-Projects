import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer-container">
      <p>Aplicación creada por Carlos Rodríguez Lobato / 2026</p>
    </footer>
  `,
  styles: [`
    .footer-container {
      background-color: #177a9a;
      color: #FFEBAF;
      text-align: center;
      padding: 1.25rem 1rem;
      width: 100%;
      font-weight: 700;
      font-size: 0.95rem;
    }

    p {
      margin: 0;
    }
  `]
})
export class FooterComponent {}