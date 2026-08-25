import { AfterViewInit, Component, DestroyRef, inject, NgZone, OnDestroy, signal } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';
import { NoteService } from '../../core/services/note.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [NgxEditorModule, FormsModule, TranslatePipe, DatePipe, SlicePipe],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class NotesComponent implements AfterViewInit, OnDestroy {
  private readonly noteService = inject(NoteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  readonly notes = signal<Note[]>([]);
  readonly activeNoteId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly saveStatus = signal<'idle' | 'saved' | 'saving' | 'error'>('idle');

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule'],
    ['format_clear'],
  ];

  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    this.editor = new Editor();
    this.loadNotes();
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    if (this.autosaveTimer) clearTimeout(this.autosaveTimer);
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (res) => {
        this.notes.set(res.notes);
        if (res.notes.length > 0 && this.activeNoteId() === null) {
          this.selectNote(res.notes[0].id);
        }
      },
    });
  }

  selectNote(id: number): void {
    this.activeNoteId.set(id);
  }

  get activeNote(): Note | undefined {
    return this.notes().find((n) => n.id === this.activeNoteId());
  }

  get activeContent(): string {
    return this.activeNote?.content ?? '';
  }

  onContentChange(html: string): void {
    if (this.autosaveTimer) clearTimeout(this.autosaveTimer);

    this.autosaveTimer = setTimeout(() => {
      this.saveNote(html);
    }, 1000);
  }

  private saveNote(content: string): void {
    const id = this.activeNoteId();
    if (!id) return;

    this.saveStatus.set('saving');
    this.saving.set(true);

    this.noteService.updateNote(id, { content }).subscribe({
      next: (res) => {
        this.notes.update((list) =>
          list.map((n) => (n.id === id ? res.note : n)),
        );
        this.saveStatus.set('saved');
        this.saving.set(false);
        setTimeout(() => this.saveStatus.set('idle'), 2000);
      },
      error: () => {
        this.saveStatus.set('error');
        this.saving.set(false);
      },
    });
  }

  createNote(): void {
    this.noteService.createNote({ content: '' }).subscribe({
      next: (res) => {
        this.notes.update((list) => [res.note, ...list]);
        this.selectNote(res.note.id);
      },
    });
  }

  deleteNote(id: number): void {
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.notes.update((list) => list.filter((n) => n.id !== id));
        if (this.activeNoteId() === id) {
          const remaining = this.notes();
          this.activeNoteId.set(remaining.length > 0 ? remaining[0].id : null);
        }
      },
    });
  }
}
