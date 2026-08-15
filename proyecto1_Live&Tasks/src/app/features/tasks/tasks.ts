import { Component } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tasks',
  imports: [TranslatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent {}
