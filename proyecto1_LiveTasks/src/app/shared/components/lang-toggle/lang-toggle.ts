import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-lang-toggle',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './lang-toggle.html',
  styleUrl: './lang-toggle.scss',
})
export class LangToggleComponent {
  protected readonly i18n = inject(I18nService);

  toggle(): void {
    this.i18n.setLang(this.i18n.lang() === 'es' ? 'en' : 'es');
  }
}
