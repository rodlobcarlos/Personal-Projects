import type { Request, Response } from 'express';
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { subscribeToken, unsubscribeToken } from '../services/push.js';

const pushTokenSchema = z.object({
  token: z.string().min(1).max(4096),
});

const router = Router();

router.post('/push/token', authenticate, async (req: Request, res: Response) => {
  const parsed = pushTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await subscribeToken(req.user!.uid, parsed.data.token);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.delete('/push/token', authenticate, async (req: Request, res: Response) => {
  const parsed = pushTokenSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'VALIDATION_ERROR', details: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await unsubscribeToken(req.user!.uid, parsed.data.token);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

export default router;
