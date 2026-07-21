import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <h1>Crear cuenta</h1>
      <p>Regístrate para comenzar a usar Live&Tasks.</p>
    </section>
  `,
  styles: [`
    .page { padding: 2rem; text-align: center; }
    h1 { color: #1e82a2; }
  `]
})
export class RegisterComponent {}
