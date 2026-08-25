import type { Request, Response } from 'express';
import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { chatWithAI, generateDailySummary, isGeminiAvailable, parseNaturalTask, prioritizeTasks } from '../services/gemini.js';

const router = Router();

function requireGemini(res: Response): boolean {
  if (!isGeminiAvailable()) {
    res.status(503).json({ error: 'GEMINI_NOT_CONFIGURED' });
    return false;
  }
  return true;
}

router.post('/ai/parse', authenticate, async (req: Request, res: Response) => {
  if (!requireGemini(res)) return;

  const schema = z.object({ input: z.string().min(1).max(500) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR' });
    return;
  }

  try {
    const result = await parseNaturalTask(parsed.data.input);
    res.json(result);
  } catch {
    res.status(500).json({ error: 'AI_ERROR' });
  }
});

router.post('/ai/prioritize', authenticate, async (req: Request, res: Response) => {
  if (!requireGemini(res)) return;

  try {
    const userId = req.user!.uid;
    const [rows] = await pool.query(
      'SELECT id, title, status, priority FROM tasks WHERE user_id = :userId AND status != "done"',
      { userId },
    );
    const tasks = rows as Array<{ id: number; title: string; status: string; priority: string }>;

    if (tasks.length === 0) {
      res.json({ priorities: [] });
      return;
    }

    const priorities = await prioritizeTasks(tasks);

    for (const p of priorities) {
      await pool.query(
        'UPDATE tasks SET priority = :priority WHERE id = :id AND user_id = :userId',
        { priority: p.priority, id: p.id, userId },
      );
    }

    res.json({ priorities });
  } catch {
    res.status(500).json({ error: 'AI_ERROR' });
  }
});

router.post('/ai/chat', authenticate, async (req: Request, res: Response) => {
  if (!requireGemini(res)) return;

  const schema = z.object({ message: z.string().min(1).max(1000) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR' });
    return;
  }

  try {
    const userId = req.user!.uid;
    const [rows] = await pool.query(
      'SELECT title, status, priority FROM tasks WHERE user_id = :userId',
      { userId },
    );
    const tasks = rows as Array<{ title: string; status: string; priority: string }>;

    const reply = await chatWithAI(parsed.data.message, tasks);
    res.json({ reply });
  } catch {
    res.status(500).json({ error: 'AI_ERROR' });
  }
});

router.post('/ai/summary', authenticate, async (req: Request, res: Response) => {
  if (!requireGemini(res)) return;

  const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR' });
    return;
  }

  try {
    const userId = req.user!.uid;
    const { date } = parsed.data;

    const [rows] = await pool.query(
      `SELECT title, status, priority, due_date FROM tasks
       WHERE user_id = :userId AND (due_date = :date OR DATE(created_at) = :date)`,
      { userId, date },
    );
    const tasks = rows as Array<{ title: string; status: string; priority: string; due_date: string | null }>;

    const summary = await generateDailySummary(tasks, date);
    res.json({ summary });
  } catch {
    res.status(500).json({ error: 'AI_ERROR' });
  }
});

export default router;
