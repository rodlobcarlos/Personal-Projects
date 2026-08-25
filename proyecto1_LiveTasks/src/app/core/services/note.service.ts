import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateNotePayload, Note, UpdateNotePayload } from '../../models/note.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/notes`;

  getNotes(): Observable<{ notes: Note[] }> {
    return this.http.get<{ notes: Note[] }>(this.url);
  }

  getNote(id: number): Observable<{ note: Note }> {
    return this.http.get<{ note: Note }>(`${this.url}/${id}`);
  }

  createNote(payload: CreateNotePayload): Observable<{ note: Note }> {
    return this.http.post<{ note: Note }>(this.url, payload);
  }

  updateNote(id: number, payload: UpdateNotePayload): Observable<{ note: Note }> {
    return this.http.patch<{ note: Note }>(`${this.url}/${id}`, payload);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
