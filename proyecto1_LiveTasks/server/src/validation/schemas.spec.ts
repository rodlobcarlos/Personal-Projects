import { describe, expect, it } from 'vitest';
import {
  aiChatSchema,
  aiParseSchema,
  aiSummarySchema,
  createNoteSchema,
  createTaskSchema,
  noteIdSchema,
  taskIdSchema,
  updateNoteSchema,
  updateTaskSchema,
} from './schemas.js';

describe('createTaskSchema', () => {
  it('accepts a minimal valid task', () => {
    const res = createTaskSchema.safeParse({ title: 'Comprar pan' });
    expect(res.success).toBe(true);
  });

  it('rejects an empty title', () => {
    expect(createTaskSchema.safeParse({ title: '' }).success).toBe(false);
  });

  it('rejects a title that is too long', () => {
    expect(createTaskSchema.safeParse({ title: 'x'.repeat(256) }).success).toBe(false);
  });

  it('accepts all valid task fields', () => {
    const res = createTaskSchema.safeParse({
      title: 'Tarea',
      description: 'desc',
      status: 'doing',
      priority: 'high',
      due_date: '2026-09-01',
    });
    expect(res.success).toBe(true);
  });

  it('rejects an invalid status', () => {
    expect(createTaskSchema.safeParse({ title: 't', status: 'archived' }).success).toBe(false);
  });

  it('rejects an invalid priority', () => {
    expect(createTaskSchema.safeParse({ title: 't', priority: 'urgent' }).success).toBe(false);
  });
});

describe('updateTaskSchema', () => {
  it('allows partial updates', () => {
    expect(updateTaskSchema.safeParse({ status: 'done' }).success).toBe(true);
    expect(updateTaskSchema.safeParse({ priority: 'low' }).success).toBe(true);
  });
});

describe('taskIdSchema', () => {
  it('accepts positive integers', () => {
    expect(taskIdSchema.safeParse(5).success).toBe(true);
  });

  it('rejects non-numbers and zero', () => {
    expect(taskIdSchema.safeParse(-1).success).toBe(false);
    expect(taskIdSchema.safeParse('abc').success).toBe(false);
  });
});

describe('createNoteSchema', () => {
  it('requires content but allows empty string for a fresh note', () => {
    expect(createNoteSchema.safeParse({ content: 'hola' }).success).toBe(true);
    expect(createNoteSchema.safeParse({}).success).toBe(false);
    expect(createNoteSchema.safeParse({ content: '' }).success).toBe(true);
  });

  it('accepts an optional title', () => {
    expect(createNoteSchema.safeParse({ title: 'Nota', content: 'x' }).success).toBe(true);
  });
});

describe('updateNoteSchema', () => {
  it('allows optional fields', () => {
    expect(updateNoteSchema.safeParse({ title: 'nuevo' }).success).toBe(true);
    expect(updateNoteSchema.safeParse({}).success).toBe(true);
  });
});

describe('noteIdSchema', () => {
  it('accepts positive integers', () => {
    expect(noteIdSchema.safeParse(3).success).toBe(true);
  });

  it('rejects invalid ids', () => {
    expect(noteIdSchema.safeParse(0).success).toBe(false);
    expect(noteIdSchema.safeParse(-2).success).toBe(false);
  });
});

describe('ai schemas', () => {
  it('validates parse input', () => {
    expect(aiParseSchema.safeParse({ input: 'comprar pan' }).success).toBe(true);
    expect(aiParseSchema.safeParse({ input: '' }).success).toBe(false);
  });

  it('validates chat message', () => {
    expect(aiChatSchema.safeParse({ message: 'hola' }).success).toBe(true);
    expect(aiChatSchema.safeParse({ message: '' }).success).toBe(false);
  });

  it('validates summary date format', () => {
    expect(aiSummarySchema.safeParse({ date: '2026-08-30' }).success).toBe(true);
    expect(aiSummarySchema.safeParse({ date: '30/08/2026' }).success).toBe(false);
  });
});
