import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  due_date: z.string().nullable().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskIdSchema = z.coerce.number().int().positive();

export const createNoteSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().min(1),
});

export const updateNoteSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().min(1).optional(),
});

export const noteIdSchema = z.coerce.number().int().positive();

export const aiParseSchema = z.object({ input: z.string().min(1).max(500) });
export const aiChatSchema = z.object({ message: z.string().min(1).max(1000) });
export const aiSummarySchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
