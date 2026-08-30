import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { AiService } from '../../core/services/ai.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss',
})
export class ChatWidgetComponent implements AfterViewInit {
  private readonly aiService = inject(AiService);

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  readonly open = signal(false);
  readonly input = signal('');
  readonly sending = signal(false);
  readonly messages = signal<ChatMessage[]>([]);

  ngAfterViewInit(): void {
    const panel = this.panelRef()?.nativeElement;
    if (panel) {
      gsap.set(panel, { autoAlpha: 0, y: 16, scale: 0.96 });
      gsap.set(panel, { transformOrigin: 'bottom right' });
    }
  }

  toggle(): void {
    this.open.update((v) => {
      const next = !v;
      this.animatePanel(next);
      return next;
    });
  }

  send(): void {
    const text = this.input().trim();
    if (!text || this.sending()) return;

    this.messages.update((list) => [...list, { role: 'user', text }]);
    this.input.set('');
    this.sending.set(true);

    this.aiService.chat(text).subscribe({
      next: (res) => {
        this.messages.update((list) => [...list, { role: 'assistant', text: res.reply }]);
        this.sending.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update((list) => [
          ...list,
          { role: 'assistant', text: 'ai.chatError' },
        ]);
        this.sending.set(false);
        this.scrollToBottom();
      },
    });
  }

  clear(): void {
    this.messages.set([]);
  }

  private animatePanel(open: boolean): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;
    if (open) {
      gsap.to(panel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(panel, { autoAlpha: 0, y: 16, scale: 0.96, duration: 0.25, ease: 'power2.in' });
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.chat-panel__messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }
}
