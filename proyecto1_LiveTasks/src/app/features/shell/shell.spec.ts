import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ShellComponent } from './shell';
import { AuthService } from '../../core/services/auth.service';

describe('ShellComponent', () => {
  let authServiceSpy: { logOut: ReturnType<typeof vi.fn> };

  function setup(): ShellComponent {
    authServiceSpy = { logOut: vi.fn(() => of(undefined)) };
    TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
    const fixture = TestBed.createComponent(ShellComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    return comp;
  }

  it('should create the shell', () => {
    expect(setup()).toBeTruthy();
  });

  it('should call logout on the auth service', () => {
    const comp = setup();
    comp.logout();
    expect(authServiceSpy.logOut).toHaveBeenCalled();
  });

  it('should scroll to a section by id', () => {
    const comp = setup();
    const target = { scrollIntoView: vi.fn() } as unknown as HTMLElement;
    const getById = vi.spyOn(document, 'getElementById').mockReturnValue(target);
    comp.scrollTo('tasks');
    expect(getById).toHaveBeenCalledWith('tasks');
    expect(target.scrollIntoView).toHaveBeenCalled();
    getById.mockRestore();
  });
});
