import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ChatWidgetComponent } from './chat-widget';
import { AiService } from '../../core/services/ai.service';

describe('ChatWidgetComponent', () => {
  let aiServiceSpy: { chat: ReturnType<typeof vi.fn> };

  function setup(chat?: ReturnType<typeof vi.fn>): {
    fixture: ComponentFixture<ChatWidgetComponent>;
    comp: ChatWidgetComponent;
  } {
    aiServiceSpy = { chat: chat ?? vi.fn(() => of({ reply: 'respuesta de la IA' })) };
    TestBed.configureTestingModule({
      imports: [ChatWidgetComponent],
      providers: [{ provide: AiService, useValue: aiServiceSpy }],
    });
    const fixture = TestBed.createComponent(ChatWidgetComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, comp };
  }

  it('should create', () => {
    expect(setup().comp).toBeTruthy();
  });

  it('starts with the panel closed', () => {
    const { comp } = setup();
    expect(comp.open()).toBe(false);
  });

  it('opens on toggle', () => {
    const { comp } = setup();
    comp.toggle();
    expect(comp.open()).toBe(true);
  });

  it('sends a message and appends the assistant reply', () => {
    const { comp, fixture } = setup();
    comp.input.set('¿qué hay pendiente?');
    comp.send();
    expect(aiServiceSpy.chat).toHaveBeenCalledWith('¿qué hay pendiente?');
    fixture.detectChanges();
    expect(comp.messages().length).toBe(2);
    expect(comp.messages()[0].role).toBe('user');
    expect(comp.messages()[1].role).toBe('assistant');
    expect(comp.messages()[1].text).toBe('respuesta de la IA');
    expect(comp.input()).toBe('');
  });

  it('does not send an empty message', () => {
    const { comp } = setup();
    comp.send();
    expect(aiServiceSpy.chat).not.toHaveBeenCalled();
  });

  it('appends an error message when the assistant fails', () => {
    const { comp, fixture } = setup(vi.fn(() => throwError(() => new Error('fail'))));
    comp.input.set('hola');
    comp.send();
    fixture.detectChanges();
    expect(comp.messages().length).toBe(2);
    expect(comp.messages()[1].text).toBe('ai.chatError');
  });

  it('clears the conversation', () => {
    const { comp } = setup();
    comp.input.set('hola');
    comp.send();
    comp.clear();
    expect(comp.messages()).toEqual([]);
  });
});
