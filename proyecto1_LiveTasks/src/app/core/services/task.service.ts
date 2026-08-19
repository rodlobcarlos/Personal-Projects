import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/tasks`;

  getTasks(status?: string): Observable<{ tasks: Task[] }> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<{ tasks: Task[] }>(this.url, { params });
  }

  createTask(payload: CreateTaskPayload): Observable<{ task: Task }> {
    return this.http.post<{ task: Task }>(this.url, payload);
  }

  updateTask(id: number, payload: UpdateTaskPayload): Observable<{ task: Task }> {
    return this.http.patch<{ task: Task }>(`${this.url}/${id}`, payload);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
