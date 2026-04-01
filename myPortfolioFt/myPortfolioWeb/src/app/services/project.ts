import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Project {
  id?: number;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/projects`;

  // Use a signal for global state management
  projects = signal<Project[]>([]);

  loadProjects() {
    this.http.get<Project[]>(this.url).subscribe(data => {
      this.projects.set(data);
    });
  }
}