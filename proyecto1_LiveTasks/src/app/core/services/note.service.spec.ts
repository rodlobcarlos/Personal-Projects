import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoteService } from './note.service';
import { environment } from '../../../environments/environment';

describe('NoteService', () => {
  let service: NoteService;
  let httpMock: HttpTestingController;
  const url = `${environment.apiUrl}/notes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET all notes', () => {
    const body = { notes: [] };
    service.getNotes().subscribe((res) => expect(res).toEqual(body));
    httpMock.expectOne(url).flush(body);
  });

  it('should GET a single note', () => {
    const body = { note: { id: 3 } };
    service.getNote(3).subscribe((res) => expect(res).toEqual(body));
    const req = httpMock.expectOne(`${url}/3`);
    expect(req.request.method).toBe('GET');
    req.flush(body);
  });

  it('should POST a note', () => {
    const payload = { content: 'hola' };
    service.createNote(payload).subscribe();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ note: { id: 1, content: 'hola' } });
  });

  it('should PATCH a note update', () => {
    service.updateNote(2, { content: 'x' }).subscribe();
    const req = httpMock.expectOne(`${url}/2`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ note: { id: 2, content: 'x' } });
  });

  it('should DELETE a note', () => {
    service.deleteNote(4).subscribe();
    const req = httpMock.expectOne(`${url}/4`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
