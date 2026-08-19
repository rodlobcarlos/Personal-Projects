import { Component } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <section class="placeholder">
      <h1>{{ 'monitoring.title' | translate }}</h1>
      <p>{{ 'tasks.comingSoon' | translate }}</p>
    </section>
  `,
  styles: `
    .placeholder {
      display: grid;
      place-content: center;
      text-align: center;
      gap: var(--space-2);
      padding: var(--space-12) var(--space-4);
    }
    h1 { font-size: 2rem; }
    p { color: var(--color-text-muted); }
  `,
})
export class MonitoringComponent {}
