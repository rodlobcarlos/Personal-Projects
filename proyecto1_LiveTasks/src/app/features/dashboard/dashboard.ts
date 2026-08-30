import { AfterViewInit, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TasksComponent } from '../tasks/tasks';
import { CalendarComponent } from '../calendar/calendar';
import { MonitoringComponent } from '../monitoring/monitoring';
import { NotesComponent } from '../notes/notes';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TasksComponent, CalendarComponent, MonitoringComponent, NotesComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly rootRef = viewChild<ElementRef<HTMLElement>>('root');

  ngAfterViewInit(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const root = this.rootRef()?.nativeElement;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>('.dash-section'));

    gsap.set(sections, { autoAlpha: 0, y: 40 });

    const trigger = ScrollTrigger.batch(sections, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
        });
      },
    });

    this.destroyRef.onDestroy(() => {
      trigger.forEach((t) => t.kill());
    });
  }
}
