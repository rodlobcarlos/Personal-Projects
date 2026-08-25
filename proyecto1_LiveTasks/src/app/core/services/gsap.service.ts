import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

gsap.defaults({ duration: 0.6, ease: 'power2.out' });

@Injectable({ providedIn: 'root' })
export class GsapService {
  readonly gsap = gsap;

  fadeUp(target: gsap.TweenTarget, vars?: gsap.TweenVars): gsap.core.Tween {
    return gsap.from(target, {
      autoAlpha: 0,
      y: 30,
      ...vars,
    });
  }

  fadeIn(target: gsap.TweenTarget, vars?: gsap.TweenVars): gsap.core.Tween {
    return gsap.from(target, {
      autoAlpha: 0,
      ...vars,
    });
  }

  staggerIn(target: gsap.TweenTarget, vars?: gsap.TweenVars): gsap.core.Tween {
    return gsap.from(target, {
      autoAlpha: 0,
      y: 20,
      stagger: 0.1,
      ...vars,
    });
  }

  scaleIn(target: gsap.TweenTarget, vars?: gsap.TweenVars): gsap.core.Tween {
    return gsap.from(target, {
      autoAlpha: 0,
      scale: 0.9,
      ...vars,
    });
  }

  slideIn(target: gsap.TweenTarget, vars?: gsap.TweenVars): gsap.core.Tween {
    return gsap.from(target, {
      autoAlpha: 0,
      x: -20,
      ...vars,
    });
  }
}
