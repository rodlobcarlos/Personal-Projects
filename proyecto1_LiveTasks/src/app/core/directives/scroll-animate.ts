import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly delay = input(0);

  ngAfterViewInit(): void {
    const native = this.el.nativeElement;

    gsap.set(native, { autoAlpha: 0, y: 30 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(native, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            delay: this.delay() / 1000,
            ease: 'power2.out',
          });
          observer.unobserve(native);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(native);

    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
