import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <h1>Iniciar sesión</h1>
      <p>Accede a tu cuenta y continúa con tus tareas.</p>
    </section>
  `,
  styles: [`
    .page { padding: 2rem; text-align: center; }
    h1 { color: #1e82a2; }
  `]
})
export class LoginComponent {}
