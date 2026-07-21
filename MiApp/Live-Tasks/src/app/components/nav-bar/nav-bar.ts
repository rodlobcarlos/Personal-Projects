import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="nav-container">
      <nav aria-label="Navegación principal">
        <ul class="nav-list">
          <li><a routerLink="/about" class="nav-link">¿Qué es Live&Tasks?</a></li>
          <li><a routerLink="/pricing" class="nav-link">Planes</a></li>
          <li><a routerLink="/register" class="nav-link">Crear cuenta</a></li>
          <li><a routerLink="/login" class="nav-link">Iniciar sesión</a></li>
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    .nav-container {
      display: flex;
      justify-content: center;
      padding-top: 1.5rem;
      width: 100%;
    }

    nav {
      background-color: #fceea7;
      border-radius: 2rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      padding: 0.75rem 3rem;
      max-width: 900px;
      width: 85%;
    }

    .nav-list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 1.5rem;
    }

    .nav-link {
      color: #1e82a2;
      font-weight: 700;
      text-decoration: none;
      font-size: 1rem;
      transition: opacity 0.2s ease;

      &:hover, &:focus-visible {
        opacity: 0.75;
        outline: none;
      }
    }
  `]
})
export class NavbarComponent {}