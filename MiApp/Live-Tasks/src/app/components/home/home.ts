import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../nav-bar/nav-bar';
import { HeroComponent } from '../hero/hero';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-layout">
      <app-navbar />
      <main class="content">
        <app-hero />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    .page-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #FFEBAF;
      font-family: karla, sans-serif;
    }

    .content {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  `]
})
export class HomeComponent {}