import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'LiveTasks';

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.handleGoogleCallback();
  }

  private handleGoogleCallback(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refresh = params.get('refresh');

    if (token && refresh) {
      localStorage.setItem('livetasks_token', token);
      localStorage.setItem('livetasks_refresh', refresh);

      this.authService.fetchMe().subscribe({
        next: ({ user }) => {
          this.authService.setGoogleSession(token, refresh, user);
          window.history.replaceState({}, document.title, window.location.pathname);
          this.router.navigate(['/app']);
        },
        error: () => {
          window.history.replaceState({}, document.title, window.location.pathname);
          this.router.navigate(['/login']);
        },
      });
    }
  }
}
