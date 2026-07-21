import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pricing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <h1>Planes</h1>
      <p>Elige el plan que mejor se adapte a ti.</p>
    </section>
  `,
  styles: [`
    .page { padding: 2rem; text-align: center; }
    h1 { color: #1e82a2; }
  `]
})
export class PricingComponent {}
