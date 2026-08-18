import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private observer!: IntersectionObserver;

  readonly delay = input(0);

  ngAfterViewInit(): void {
    const native = this.el.nativeElement;
    native.classList.add('scroll-animate');
    native.style.transitionDelay = `${this.delay()}ms`;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          native.classList.add('scroll-visible');
          this.observer.unobserve(native);
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(native);

    this.destroyRef.onDestroy(() => this.observer.disconnect());
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
