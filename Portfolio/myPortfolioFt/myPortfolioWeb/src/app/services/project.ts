import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Project {
  id?: number;
  title: string;
  description: string;
  techStack: string;
  github_url: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  // The Signal that your components will listen to
  projects = signal<Project[]>([]);

  /**
   * Fetches projects from Spring Boot and updates the Signal.
   * Call this in ngOnInit of your component.
   */
  loadProjects() {
    this.http.get<Project[]>(this.url).subscribe({
      next: (data) => {
        this.projects.set(data);
      },
      error: (err) => {
        console.error('Error fetching projects from MySQL:', err);
      }
    });
  }
}
