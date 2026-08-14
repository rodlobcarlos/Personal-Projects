import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  protected readonly features = [
    { key: 'tasks', desc: 'tasksDesc' },
    { key: 'calendar', desc: 'calendarDesc' },
    { key: 'monitoring', desc: 'monitoringDesc' },
    { key: 'notes', desc: 'notesDesc' },
  ] as const;
}
