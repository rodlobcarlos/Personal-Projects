import type { Request, Response } from 'express';
import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  due_date: z.string().nullable().optional(),
});

const updateTaskSchema = createTaskSchema.partial();

router.get('/tasks', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { status } = req.query;

    let sql = 'SELECT * FROM tasks WHERE user_id = :userId';
    const params: Record<string, string> = { userId };

    if (status === 'todo' || status === 'doing' || status === 'done') {
      sql += ' AND status = :status';
      params.status = status;
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json({ tasks: rows });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.get('/tasks/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const taskId = Number(req.params.id);

    if (!Number.isFinite(taskId)) {
      res.status(400).json({ error: 'INVALID_ID' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = :userId AND id = :id',
      { userId, id: taskId },
    );

    const task = (rows as Record<string, unknown>[])[0];
    if (!task) {
      res.status(404).json({ error: 'TASK_NOT_FOUND' });
      return;
    }

    res.json({ task });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.post('/tasks', authenticate, async (req: Request, res: Response) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const userId = req.user!.uid;
    const { title, description, status, priority, due_date } = parsed.data;

    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES (:userId, :title, :description, :status, :priority, :dueDate)`,
      {
        userId,
        title,
        description: description ?? null,
        status: status ?? 'todo',
        priority: priority ?? 'medium',
        dueDate: due_date ?? null,
      } as Record<string, string | null>,
    );

    const insertId = (result as { insertId: number }).insertId;

    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = :id AND user_id = :userId',
      { id: insertId, userId },
    );

    const task = (rows as Record<string, unknown>[])[0];
    res.status(201).json({ task });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.patch('/tasks/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const userId = req.user!.uid;
    const taskId = Number(req.params.id);

    if (!Number.isFinite(taskId)) {
      res.status(400).json({ error: 'INVALID_ID' });
      return;
    }

    const fields = parsed.data;
    const entries = Object.entries(fields).filter(([, v]) => v !== undefined);

    if (entries.length === 0) {
      res.status(400).json({ error: 'NO_FIELDS' });
      return;
    }

    const columnMap: Record<string, string> = {
      title: 'title',
      description: 'description',
      status: 'status',
      priority: 'priority',
      due_date: 'due_date',
    };

    const setClauses: string[] = [];
    const params: Record<string, string | number | null> = { userId, id: taskId };

    for (const [key, value] of entries) {
      const col = columnMap[key];
      if (col) {
        setClauses.push(`${col} = :${key}`);
        params[key] = value;
      }
    }

    if (setClauses.length === 0) {
      res.status(400).json({ error: 'NO_FIELDS' });
      return;
    }

    const [result] = await pool.query(
      `UPDATE tasks SET ${setClauses.join(', ')} WHERE user_id = :userId AND id = :id`,
      params,
    );

    const affected = (result as { affectedRows: number }).affectedRows;
    if (affected === 0) {
      res.status(404).json({ error: 'TASK_NOT_FOUND' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = :id AND user_id = :userId',
      { id: taskId, userId },
    );

    const task = (rows as Record<string, unknown>[])[0];
    res.json({ task });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.delete('/tasks/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const taskId = Number(req.params.id);

    if (!Number.isFinite(taskId)) {
      res.status(400).json({ error: 'INVALID_ID' });
      return;
    }

    const [result] = await pool.query(
      'DELETE FROM tasks WHERE user_id = :userId AND id = :id',
      { userId, id: taskId },
    );

    const affected = (result as { affectedRows: number }).affectedRows;
    if (affected === 0) {
      res.status(404).json({ error: 'TASK_NOT_FOUND' });
      return;
    }

    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

export default router;
