import { Component, input } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  readonly task = input.required<Task>();

  protected editing = false;
  protected editValue = '';

  constructor(private readonly service: TaskService) {}

  protected toggle(): void {
    this.service.toggleTask(this.task().id);
  }

  protected startEdit(): void {
    this.editValue = this.task().title;
    this.editing = true;
  }

  protected saveEdit(): void {
    if (this.editValue.trim()) {
      this.service.editTask(this.task().id, this.editValue);
    }
    this.editing = false;
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.editing = false;
    }
  }

  protected delete(): void {
    this.service.deleteTask(this.task().id);
  }
}
