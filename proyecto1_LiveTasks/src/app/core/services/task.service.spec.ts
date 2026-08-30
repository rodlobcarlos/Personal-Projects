import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const url = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET tasks', () => {
    const body = { tasks: [] };
    service.getTasks().subscribe((res) => expect(res).toEqual(body));
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(body);
  });

  it('should POST a task with the payload', () => {
    const payload = { title: 'Comprar leche' };
    const body = { task: { id: 1, title: 'Comprar leche' } };
    service.createTask(payload).subscribe((res) => expect(res).toEqual(body));
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(body);
  });

  it('should PATCH a task update', () => {
    const payload = { status: 'done' as const };
    const body = { task: { id: 5, status: 'done' } };
    service.updateTask(5, payload).subscribe((res) => expect(res).toEqual(body));
    const req = httpMock.expectOne(`${url}/5`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(body);
  });

  it('should DELETE a task', () => {
    service.deleteTask(9).subscribe();
    const req = httpMock.expectOne(`${url}/9`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
