import type { Request, Response } from 'express';
import { Router } from 'express';
import { pool } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { createNoteSchema, updateNoteSchema } from '../validation/schemas.js';

const router = Router();

router.get('/notes', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE user_id = :userId ORDER BY updated_at DESC',
      { userId },
    );
    res.json({ notes: rows });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.get('/notes/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const noteId = Number(req.params.id);

    if (!Number.isFinite(noteId)) {
      res.status(400).json({ error: 'INVALID_ID' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE user_id = :userId AND id = :id',
      { userId, id: noteId },
    );

    const note = (rows as Record<string, unknown>[])[0];
    if (!note) {
      res.status(404).json({ error: 'NOTE_NOT_FOUND' });
      return;
    }

    res.json({ note });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.post('/notes', authenticate, async (req: Request, res: Response) => {
  try {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const userId = req.user!.uid;
    const { title, content } = parsed.data;

    const [result] = await pool.query(
      `INSERT INTO notes (user_id, title, content) VALUES (:userId, :title, :content)`,
      { userId, title: title ?? '', content },
    );

    const insertId = (result as { insertId: number }).insertId;

    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE id = :id AND user_id = :userId',
      { id: insertId, userId },
    );

    const note = (rows as Record<string, unknown>[])[0];
    res.status(201).json({ note });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.patch('/notes/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const parsed = updateNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors });
      return;
    }

    const userId = req.user!.uid;
    const noteId = Number(req.params.id);

    if (!Number.isFinite(noteId)) {
      res.status(400).json({ error: 'INVALID_ID' });
      return;
    }

    const fields = parsed.data;
    const entries = Object.entries(fields).filter(([, v]) => v !== undefined);

    if (entries.length === 0) {
      res.status(400).json({ error: 'NO_FIELDS' });
      return;
    }

    const setClauses: string[] = [];
    const params: Record<string, string | number> = { userId, id: noteId };

    for (const [key, value] of entries) {
      setClauses.push(`${key} = :${key}`);
      params[key] = value;
    }

    const [result] = await pool.query(
      `UPDATE notes SET ${setClauses.join(', ')} WHERE user_id = :userId AND id = :id`,
      params,
    );

    const affected = (result as { affectedRows: number }).affectedRows;
    if (affected === 0) {
      res.status(404).json({ error: 'NOTE_NOT_FOUND' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE id = :id AND user_id = :userId',
      { id: noteId, userId },
    );

    const note = (rows as Record<string, unknown>[])[0];
    res.json({ note });
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.delete('/notes/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.uid;
    const noteId = Number(req.params.id);

    if (!Number.isFinite(noteId)) {
      res.status(400).json({ error: 'INVALID_ID' });
      return;
    }

    const [result] = await pool.query(
      'DELETE FROM notes WHERE user_id = :userId AND id = :id',
      { userId, id: noteId },
    );

    const affected = (result as { affectedRows: number }).affectedRows;
    if (affected === 0) {
      res.status(404).json({ error: 'NOTE_NOT_FOUND' });
      return;
    }

    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

export default router;
