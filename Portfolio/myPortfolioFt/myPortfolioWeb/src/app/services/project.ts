import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  // Ensure this matches your Spring Boot @RequestMapping
  private url = 'https://personal-projects-production-32d7.up.railway.app/api/projects'; 

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