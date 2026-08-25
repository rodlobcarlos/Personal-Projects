import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/ai`;

  parseNatural(input: string): Observable<{ title: string; priority: 'low' | 'medium' | 'high'; due_date: string | null }> {
    return this.http.post<{ title: string; priority: 'low' | 'medium' | 'high'; due_date: string | null }>(
      `${this.url}/parse`,
      { input },
    );
  }

  prioritize(): Observable<{ priorities: { id: number; priority: 'low' | 'medium' | 'high' }[] }> {
    return this.http.post<{ priorities: { id: number; priority: 'low' | 'medium' | 'high' }[] }>(
      `${this.url}/prioritize`,
      {},
    );
  }

  chat(message: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${this.url}/chat`, { message });
  }

  dailySummary(date: string): Observable<{ summary: string }> {
    return this.http.post<{ summary: string }>(`${this.url}/summary`, { date });
  }
}
