import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Page,
  Project,
  ProjectPayload,
  ProjectQuery,
  ProjectStats,
  ProjectUpdatePayload,
  Task,
  TaskPayload,
  TaskQuery,
  User,
} from './models';

/** Traduce los parámetros de consulta a HttpParams omitiendo los vacíos. */
function toParams(query: Record<string, unknown>): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    params = params.set(key, String(value));
  }
  return params;
}

@Injectable({ providedIn: 'root' })
export class ProjectsApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}`;

  // --- Proyectos -----------------------------------------------------------

  listProjects(query: ProjectQuery = {}): Observable<Page<Project>> {
    return this.http.get<Page<Project>>(`${this.base}/projects`, {
      params: toParams(query as Record<string, unknown>),
    });
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.base}/projects/${id}`);
  }

  createProject(payload: ProjectPayload): Observable<Project> {
    return this.http.post<Project>(`${this.base}/projects`, payload);
  }

  updateProject(id: number, payload: ProjectUpdatePayload): Observable<Project> {
    return this.http.put<Project>(`${this.base}/projects/${id}`, payload);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/projects/${id}`);
  }

  getStats(id: number): Observable<ProjectStats> {
    return this.http.get<ProjectStats>(`${this.base}/projects/${id}/stats`);
  }

  // --- Tareas --------------------------------------------------------------

  listTasks(projectId: number, query: TaskQuery = {}): Observable<Page<Task>> {
    return this.http.get<Page<Task>>(`${this.base}/projects/${projectId}/tasks`, {
      params: toParams(query as Record<string, unknown>),
    });
  }

  createTask(projectId: number, payload: TaskPayload): Observable<Task> {
    return this.http.post<Task>(`${this.base}/projects/${projectId}/tasks`, payload);
  }

  updateTask(taskId: number, payload: Partial<TaskPayload>): Observable<Task> {
    return this.http.put<Task>(`${this.base}/tasks/${taskId}`, payload);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/tasks/${taskId}`);
  }

  // --- Usuarios ------------------------------------------------------------

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.base}/users/me`);
  }

  updateProfile(payload: Partial<Pick<User, 'email' | 'full_name'>> & { password?: string }): Observable<User> {
    return this.http.patch<User>(`${this.base}/users/me`, payload);
  }

  listUsers(search = ''): Observable<Page<User>> {
    return this.http.get<Page<User>>(`${this.base}/users`, {
      params: toParams({ search, page_size: 50 }),
    });
  }

  /** Activa o desactiva un usuario (solo administradores). */
  setUserActive(id: number, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.base}/users/${id}`, { is_active: isActive });
  }

  deleteUser(id: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.base}/users/${id}`);
  }
}
