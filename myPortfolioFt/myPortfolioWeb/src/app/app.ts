import { Component } from '@angular/core';
import { SpaceBackgroundComponent } from './components/space-background/space-background';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpaceBackgroundComponent], 
  template: `
    <app-space-background />
    
    <main class="content-wrapper">
      <router-outlet />
    </main>
  `,
  styles: `
    .content-wrapper {
      position: relative;
      z-index: 1; /* Content stays ABOVE the stars */
      color: white;
      padding: 2rem;
      min-height: 100vh;
    }
  `
})
export class AppComponent {}