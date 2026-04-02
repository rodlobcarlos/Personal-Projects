import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-space-background',
  standalone: true, // Default in v19+
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="stars-container">
      <div class="stars layer1"></div>
      <div class="stars layer2"></div>
      <div class="stars layer3"></div>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
      overflow: hidden;
      z-index: -1; /* Keep it behind everything */
    }

    .stars {
      position: absolute;
      top: 0;
      left: 0;
      width: 200%; /* Wider for movement */
      height: 200%;
      background-repeat: repeat;
      background-position: 0 0;
    }

    /* Small Stars */
    .layer1 {
      background-image: radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
                        radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0));
      background-size: 200px 200px;
      animation: moveStars 100s linear infinite;
      opacity: 0.5;
    }

    /* Medium Stars */
    .layer2 {
      background-image: radial-gradient(2px 2px at 100px 150px, #fff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 200px 300px, #ccc, rgba(0,0,0,0));
      background-size: 300px 300px;
      animation: moveStars 70s linear infinite;
    }

    @keyframes moveStars {
      from { transform: translateY(0); }
      to { transform: translateY(-1000px); }
    }
  `
})
export class SpaceBackgroundComponent {}