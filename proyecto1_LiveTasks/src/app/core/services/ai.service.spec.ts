import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AiService } from './ai.service';
import { environment } from '../../../environments/environment';

describe('AiService', () => {
  let service: AiService;
  let httpMock: HttpTestingController;
  const url = `${environment.apiUrl}/ai`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST to /parse with the input', () => {
    service.parseNatural('comprar pan mañana').subscribe();
    const req = httpMock.expectOne(`${url}/parse`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ input: 'comprar pan mañana' });
    req.flush({ title: 'comprar pan', priority: 'medium', due_date: null });
  });

  it('should POST to /prioritize', () => {
    service.prioritize().subscribe();
    const req = httpMock.expectOne(`${url}/prioritize`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ priorities: [] });
  });

  it('should POST to /chat with message', () => {
    service.chat('hola').subscribe();
    const req = httpMock.expectOne(`${url}/chat`);
    expect(req.request.body).toEqual({ message: 'hola' });
    req.flush({ reply: 'hola!' });
  });

  it('should POST to /summary with date', () => {
    service.dailySummary('2026-08-30').subscribe();
    const req = httpMock.expectOne(`${url}/summary`);
    expect(req.request.body).toEqual({ date: '2026-08-30' });
    req.flush({ summary: '2 tareas' });
  });
});
