import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LangToggleComponent } from '../../shared/components/lang-toggle/lang-toggle';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LangToggleComponent,
    ThemeToggleComponent,
    TranslatePipe,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent {
  protected readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logOut().subscribe();
  }
}
